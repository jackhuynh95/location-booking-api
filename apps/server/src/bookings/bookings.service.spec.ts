import { BadRequestException, ConflictException } from '@nestjs/common';
import {
  DataSource,
  EntityManager,
  EntityTarget,
  FindOneOptions,
  FindOperator,
  Repository,
} from 'typeorm';
import { Location } from '../locations/location.entity';
import { Booking, BookingStatus } from './booking.entity';
import { BookingsService } from './bookings.service';
import { isWithinOpenTime, parseOpenTime } from './open-time';

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

const createDataSource = (
  bookingsRepository: Repository<Booking>,
  locationsRepository: Repository<Location>,
  options: { serializeTransactions?: boolean } = {},
) => {
  const manager = {
    findOne: jest.fn(
      <T extends Booking | Location>(
        entity: EntityTarget<T>,
        query: FindOneOptions<T>,
      ): Promise<T | null> => {
        if (entity === Location) {
          return locationsRepository.findOne(
            query as FindOneOptions<Location>,
          ) as Promise<T | null>;
        }

        if (entity === Booking) {
          return bookingsRepository.findOne(
            query as FindOneOptions<Booking>,
          ) as Promise<T | null>;
        }

        return Promise.resolve(null);
      },
    ),
    create: jest.fn((_entity, booking: Partial<Booking>) =>
      bookingsRepository.create(booking),
    ),
    save: jest.fn((booking: Booking) => bookingsRepository.save(booking)),
  } as unknown as EntityManager & {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };

  let queue = Promise.resolve();
  const transaction = jest.fn(
    async <T>(callback: (manager: EntityManager) => Promise<T>): Promise<T> => {
      if (!options.serializeTransactions) {
        return callback(manager);
      }

      const run = queue.then(() => callback(manager));
      queue = run.then(
        () => undefined,
        () => undefined,
      );

      return run;
    },
  );

  return {
    manager,
    dataSource: { transaction } as unknown as DataSource & {
      transaction: jest.Mock;
    },
  };
};

const createService = (
  locations: Location[],
  initialBookings: Booking[] = [],
  options: { serializeTransactions?: boolean } = {},
) => {
  const locationsRepository = createLocationRepository(locations);
  const bookingsRepository = createBookingRepository(initialBookings);
  const { dataSource, manager } = createDataSource(
    bookingsRepository,
    locationsRepository,
    options,
  );

  return {
    bookingsRepository,
    dataSource,
    manager,
    service: new BookingsService(bookingsRepository, dataSource),
  };
};

describe('BookingsService', () => {
  it('persists a valid booking', async () => {
    const location = makeLocation({ id: 'location-1' });
    const { bookingsRepository, dataSource, manager, service } = createService([
      location,
    ]);

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
    expect(dataSource.transaction).toHaveBeenCalledTimes(1);
    expect(manager.findOne).toHaveBeenCalledWith(Location, {
      where: { id: location.id },
      lock: { mode: 'pessimistic_write' },
    });
  });

  it('rejects department mismatch', async () => {
    const location = makeLocation({ id: 'location-1', department: 'FSS' });
    const { service } = createService([location]);

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
    const { service } = createService([location]);

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
    const { service } = createService([location]);

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
    const { service } = createService([location]);

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
    const { service } = createService([location], [existing]);

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

  it('ignores cancelled bookings during overlap checks', async () => {
    const location = makeLocation({ id: 'location-1' });
    const existing = makeBooking({
      id: 'booking-1',
      locationId: location.id,
      status: BookingStatus.CANCELLED,
      startAt: new Date('2026-06-12T10:00:00.000Z'),
      endAt: new Date('2026-06-12T11:00:00.000Z'),
    });
    const { service } = createService([location], [existing]);

    await expect(
      service.create({
        locationId: location.id,
        department: 'EFM',
        attendeeCount: 4,
        startAt: '2026-06-12T10:30:00.000Z',
        endAt: '2026-06-12T11:30:00.000Z',
      }),
    ).resolves.toMatchObject({ status: BookingStatus.CONFIRMED });
  });

  it('allows adjacent bookings at exact start and end boundaries', async () => {
    const location = makeLocation({ id: 'location-1' });
    const existing = makeBooking({
      id: 'booking-1',
      locationId: location.id,
      startAt: new Date('2026-06-12T10:00:00.000Z'),
      endAt: new Date('2026-06-12T11:00:00.000Z'),
    });
    const { service } = createService([location], [existing]);

    await expect(
      service.create({
        locationId: location.id,
        department: 'EFM',
        attendeeCount: 4,
        startAt: '2026-06-12T11:00:00.000Z',
        endAt: '2026-06-12T12:00:00.000Z',
      }),
    ).resolves.toMatchObject({ locationId: location.id });

    await expect(
      service.create({
        locationId: location.id,
        department: 'EFM',
        attendeeCount: 4,
        startAt: '2026-06-12T09:00:00.000Z',
        endAt: '2026-06-12T10:00:00.000Z',
      }),
    ).resolves.toMatchObject({ locationId: location.id });
  });

  it('rejects endAt equal to startAt', async () => {
    const location = makeLocation({ id: 'location-1' });
    const { service } = createService([location]);

    await expect(
      service.create({
        locationId: location.id,
        department: 'EFM',
        attendeeCount: 4,
        startAt: '2026-06-12T10:00:00.000Z',
        endAt: '2026-06-12T10:00:00.000Z',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects endAt before startAt', async () => {
    const location = makeLocation({ id: 'location-1' });
    const { service } = createService([location]);

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

  it('rejects bookable locations with empty room department', async () => {
    const location = makeLocation({ id: 'location-1', department: null });
    const { service } = createService([location]);

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

  it('rejects bookable locations with empty room capacity', async () => {
    const location = makeLocation({ id: 'location-1', capacity: null });
    const { service } = createService([location]);

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

  it('fails safely when a stored open time uses an unsupported format', async () => {
    const location = makeLocation({
      id: 'location-1',
      openTime: 'weekdays 9-6',
    });
    const { service } = createService([location]);

    await expect(
      service.create({
        locationId: location.id,
        department: 'EFM',
        attendeeCount: 4,
        startAt: '2026-06-12T10:00:00.000Z',
        endAt: '2026-06-12T11:00:00.000Z',
      }),
    ).rejects.toThrow('Unsupported open time format weekdays 9-6');
  });

  it('allows only one concurrent overlapping booking for the same location', async () => {
    const location = makeLocation({ id: 'location-1' });
    const { service } = createService([location], [], {
      serializeTransactions: true,
    });

    const results = await Promise.allSettled([
      service.create({
        locationId: location.id,
        department: 'EFM',
        attendeeCount: 4,
        startAt: '2026-06-12T10:00:00.000Z',
        endAt: '2026-06-12T11:00:00.000Z',
      }),
      service.create({
        locationId: location.id,
        department: 'EFM',
        attendeeCount: 4,
        startAt: '2026-06-12T10:30:00.000Z',
        endAt: '2026-06-12T11:30:00.000Z',
      }),
    ]);

    const fulfilled = results.filter((result) => result.status === 'fulfilled');
    const rejected = results.filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    );

    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    const rejectionReason: unknown = rejected[0].reason;

    expect(rejectionReason).toBeInstanceOf(ConflictException);
    if (!(rejectionReason instanceof ConflictException)) {
      throw new Error('Expected conflicting request to reject with 409');
    }
    expect(rejectionReason.message).toBe(
      'Booking overlaps an existing booking for this location',
    );
  });
});

describe('isWithinOpenTime', () => {
  const openTime = 'Mon to Fri (9AM to 6PM)';

  it('accepts same-day booking inside open hours', () => {
    expect(
      isWithinOpenTime(
        openTime,
        '2026-06-12T10:00:00.000Z',
        '2026-06-12T11:00:00.000Z',
      ),
    ).toBe(true);
  });

  it('rejects same-day booking before opening', () => {
    expect(
      isWithinOpenTime(
        openTime,
        '2026-06-12T08:00:00.000Z',
        '2026-06-12T09:00:00.000Z',
      ),
    ).toBe(false);
  });

  it('rejects same-day booking after closing', () => {
    expect(
      isWithinOpenTime(
        openTime,
        '2026-06-12T17:00:00.000Z',
        '2026-06-12T19:00:00.000Z',
      ),
    ).toBe(false);
  });

  it('rejects overnight booking from Mon 22:00 to Tue 02:00', () => {
    expect(
      isWithinOpenTime(
        openTime,
        '2026-06-08T22:00:00.000Z',
        '2026-06-09T02:00:00.000Z',
      ),
    ).toBe(false);
  });

  it('rejects multi-day booking even when both wall-clock times fit', () => {
    expect(
      isWithinOpenTime(
        openTime,
        '2026-06-08T10:00:00.000Z',
        '2026-06-09T11:00:00.000Z',
      ),
    ).toBe(false);
  });

  it('rejects weekend booking for Mon-Fri rooms', () => {
    expect(
      isWithinOpenTime(
        openTime,
        '2026-06-14T10:00:00.000Z',
        '2026-06-14T11:00:00.000Z',
      ),
    ).toBe(false);
  });

  it('accepts Always open without day or hour restrictions', () => {
    expect(
      isWithinOpenTime(
        'Always open',
        '2026-06-14T23:00:00.000Z',
        '2026-06-14T23:30:00.000Z',
      ),
    ).toBe(true);
  });

  it.each([
    ['Mon to Fri (9AM to 6PM)', '2026-06-12T10:00:00.000Z', true],
    ['Mon to Sat (9AM to 6PM)', '2026-06-13T10:00:00.000Z', true],
    ['Mon to Sun (9AM to 6PM)', '2026-06-14T10:00:00.000Z', true],
    ['Mon to Fri (9AM to 6PM)', '2026-06-13T10:00:00.000Z', false],
  ])(
    'evaluates supported day ranges for %s',
    (roomOpenTime, startAt, expected) => {
      expect(
        isWithinOpenTime(
          roomOpenTime,
          startAt,
          startAt.replace('10:00:00.000Z', '11:00:00.000Z'),
        ),
      ).toBe(expected);
    },
  );

  it('throws a 400 exception for unsupported open-time strings', () => {
    expect(() => parseOpenTime('Mon-Fri 9AM-6PM')).toThrow(BadRequestException);
  });
});
