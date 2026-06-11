import { BadRequestException, ConflictException } from '@nestjs/common';
import { FindOperator, Repository } from 'typeorm';
import { Location } from '../locations/location.entity';
import { Booking, BookingStatus } from './booking.entity';
import { BookingsService } from './bookings.service';

const date = new Date('2026-06-11T00:00:00.000Z');

const makeLocation = (seed: Partial<Location> & { id: string }): Location => ({
  building: 'A',
  name: 'Meeting Room 1',
  number: 'A-01-01',
  department: 'EFM',
  capacity: 10,
  openTime: 'Mon to Fri (9AM to 6PM)',
  isBookable: true,
  parentId: null,
  parent: null,
  children: [],
  bookings: [],
  createdAt: date,
  updatedAt: date,
  ...seed,
});

const makeBooking = (seed: Partial<Booking> & { id: string }): Booking => ({
  locationId: 'location-1',
  location: makeLocation({ id: 'location-1' }),
  department: 'EFM',
  attendeeCount: 2,
  startAt: new Date('2026-06-12T10:00:00.000Z'),
  endAt: new Date('2026-06-12T11:00:00.000Z'),
  status: BookingStatus.CONFIRMED,
  createdAt: date,
  updatedAt: date,
  ...seed,
});

const createLocationRepository = (locations: Location[]) => {
  const records = new Map(locations.map((location) => [location.id, location]));

  return {
    findOne: jest.fn(({ where }: { where: Partial<Location> }) =>
      Promise.resolve(where.id ? (records.get(where.id) ?? null) : null),
    ),
  } as unknown as Repository<Location>;
};

const getFindOperatorValue = (operator: FindOperator<Date>): Date =>
  operator.value;

const createBookingRepository = (initialBookings: Booking[] = []) => {
  const records = new Map(
    initialBookings.map((booking) => [booking.id, booking]),
  );

  const repository = {
    create: jest.fn((booking: Partial<Booking>) =>
      makeBooking({
        id: booking.id ?? `booking-${records.size + 1}`,
        ...booking,
      }),
    ),
    save: jest.fn((booking: Booking) => {
      records.set(booking.id, booking);
      return Promise.resolve(booking);
    }),
    find: jest.fn(() =>
      Promise.resolve(
        Array.from(records.values()).sort(
          (left, right) => left.startAt.getTime() - right.startAt.getTime(),
        ),
      ),
    ),
    findOne: jest.fn(({ where }: { where: Partial<Booking> }) => {
      if (where.id !== undefined) {
        return Promise.resolve(records.get(where.id) ?? null);
      }

      if (
        where.locationId !== undefined &&
        where.status !== undefined &&
        where.startAt instanceof FindOperator &&
        where.endAt instanceof FindOperator
      ) {
        const requestedEndAt = getFindOperatorValue(where.startAt);
        const requestedStartAt = getFindOperatorValue(where.endAt);

        return Promise.resolve(
          Array.from(records.values()).find(
            (booking) =>
              booking.locationId === where.locationId &&
              booking.status === where.status &&
              booking.startAt < requestedEndAt &&
              booking.endAt > requestedStartAt,
          ) ?? null,
        );
      }

      return Promise.resolve(null);
    }),
    records,
  };

  return repository as unknown as Repository<Booking> & {
    records: Map<string, Booking>;
  };
};

describe('BookingsService', () => {
  it('persists a valid booking', async () => {
    const location = makeLocation({ id: 'location-1' });
    const bookingsRepository = createBookingRepository();
    const service = new BookingsService(
      bookingsRepository,
      createLocationRepository([location]),
    );

    const booking = await service.create({
      locationId: location.id,
      department: 'EFM',
      attendeeCount: 4,
      startAt: '2026-06-12T10:00:00.000Z',
      endAt: '2026-06-12T11:00:00.000Z',
    });

    expect(booking).toMatchObject({
      locationId: location.id,
      department: 'EFM',
      attendeeCount: 4,
      status: BookingStatus.CONFIRMED,
    });
    expect(bookingsRepository.records.get(booking.id)).toBeDefined();
  });

  it('rejects department mismatch', async () => {
    const location = makeLocation({ id: 'location-1', department: 'FSS' });
    const service = new BookingsService(
      createBookingRepository(),
      createLocationRepository([location]),
    );

    await expect(
      service.create({
        locationId: location.id,
        department: 'EFM',
        attendeeCount: 4,
        startAt: '2026-06-12T10:00:00.000Z',
        endAt: '2026-06-12T11:00:00.000Z',
      }),
    ).rejects.toThrow('Booking department does not match location department');
  });

  it('rejects capacity overflow', async () => {
    const location = makeLocation({ id: 'location-1', capacity: 3 });
    const service = new BookingsService(
      createBookingRepository(),
      createLocationRepository([location]),
    );

    await expect(
      service.create({
        locationId: location.id,
        department: 'EFM',
        attendeeCount: 4,
        startAt: '2026-06-12T10:00:00.000Z',
        endAt: '2026-06-12T11:00:00.000Z',
      }),
    ).rejects.toThrow('Booking attendee count exceeds location capacity');
  });

  it('rejects closed-time booking', async () => {
    const location = makeLocation({ id: 'location-1' });
    const service = new BookingsService(
      createBookingRepository(),
      createLocationRepository([location]),
    );

    await expect(
      service.create({
        locationId: location.id,
        department: 'EFM',
        attendeeCount: 4,
        startAt: '2026-06-14T10:00:00.000Z',
        endAt: '2026-06-14T11:00:00.000Z',
      }),
    ).rejects.toThrow('Booking time is outside location open time');
  });

  it('rejects non-bookable location', async () => {
    const location = makeLocation({ id: 'location-1', isBookable: false });
    const service = new BookingsService(
      createBookingRepository(),
      createLocationRepository([location]),
    );

    await expect(
      service.create({
        locationId: location.id,
        department: 'EFM',
        attendeeCount: 4,
        startAt: '2026-06-12T10:00:00.000Z',
        endAt: '2026-06-12T11:00:00.000Z',
      }),
    ).rejects.toThrow('Target location is not bookable');
  });

  it('rejects overlapping confirmed bookings for the same location', async () => {
    const location = makeLocation({ id: 'location-1' });
    const existing = makeBooking({
      id: 'booking-1',
      locationId: location.id,
      startAt: new Date('2026-06-12T10:00:00.000Z'),
      endAt: new Date('2026-06-12T11:00:00.000Z'),
    });
    const service = new BookingsService(
      createBookingRepository([existing]),
      createLocationRepository([location]),
    );

    await expect(
      service.create({
        locationId: location.id,
        department: 'EFM',
        attendeeCount: 4,
        startAt: '2026-06-12T10:30:00.000Z',
        endAt: '2026-06-12T11:30:00.000Z',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('rejects endAt before startAt', async () => {
    const location = makeLocation({ id: 'location-1' });
    const service = new BookingsService(
      createBookingRepository(),
      createLocationRepository([location]),
    );

    await expect(
      service.create({
        locationId: location.id,
        department: 'EFM',
        attendeeCount: 4,
        startAt: '2026-06-12T11:00:00.000Z',
        endAt: '2026-06-12T10:00:00.000Z',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
