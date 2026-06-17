import {
  ConflictException,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App as SupertestApp } from 'supertest/types';
import { BookingStatus } from '../src/bookings/booking.entity';
import { BookingsController } from '../src/bookings/bookings.controller';
import { BookingsService } from '../src/bookings/bookings.service';

const timestamp = new Date('2026-06-11T00:00:00.000Z');
const id = '11111111-1111-4111-8111-111111111111';
const locationId = '22222222-2222-4222-8222-222222222222';

const booking = {
  id,
  locationId,
  department: 'EFM',
  attendeeCount: 4,
  startAt: new Date('2026-06-12T10:00:00.000Z'),
  endAt: new Date('2026-06-12T11:00:00.000Z'),
  status: BookingStatus.CONFIRMED,
  createdAt: timestamp,
  updatedAt: timestamp,
};

describe('BookingsController (e2e)', () => {
  let app: INestApplication;
  const service = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [{ provide: BookingsService, useValue: service }],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        transform: true,
        whitelist: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('supports create, list, and detail routes', async () => {
    const httpServer = app.getHttpServer() as SupertestApp;

    service.create.mockResolvedValue(booking);
    service.findAll.mockResolvedValue([booking]);
    service.findOne.mockResolvedValue(booking);

    await request(httpServer)
      .post('/bookings')
      .send({
        locationId,
        department: 'EFM',
        attendeeCount: 4,
        startAt: '2026-06-12T10:00:00.000Z',
        endAt: '2026-06-12T11:00:00.000Z',
      })
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          locationId,
          department: 'EFM',
          attendeeCount: 4,
          status: BookingStatus.CONFIRMED,
        });
      });

    await request(httpServer)
      .get('/bookings')
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toHaveLength(1);
      });

    await request(httpServer)
      .get(`/bookings/${id}`)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toMatchObject({ id, locationId });
      });
  });

  it('rejects invalid route UUIDs before service calls', async () => {
    const httpServer = app.getHttpServer() as SupertestApp;

    await request(httpServer)
      .get('/bookings/not-a-uuid')
      .expect(HttpStatus.BAD_REQUEST);

    expect(service.findOne).not.toHaveBeenCalled();
  });

  it('rejects invalid create payloads before service calls', async () => {
    const httpServer = app.getHttpServer() as SupertestApp;

    await request(httpServer)
      .post('/bookings')
      .send({
        locationId,
        department: 'EFM',
        attendeeCount: 0,
        startAt: 'not-a-date',
        endAt: '2026-06-12T11:00:00.000Z',
      })
      .expect(HttpStatus.BAD_REQUEST);

    expect(service.create).not.toHaveBeenCalled();
  });

  it('returns 409 when booking overlaps an existing booking', async () => {
    const httpServer = app.getHttpServer() as SupertestApp;

    service.create.mockRejectedValue(
      new ConflictException(
        'Booking overlaps an existing booking for this location',
      ),
    );

    await request(httpServer)
      .post('/bookings')
      .send({
        locationId,
        department: 'EFM',
        attendeeCount: 4,
        startAt: '2026-06-12T10:30:00.000Z',
        endAt: '2026-06-12T11:30:00.000Z',
      })
      .expect(HttpStatus.CONFLICT)
      .expect(({ body }: { body: { message?: unknown } }) => {
        expect(body.message).toBe(
          'Booking overlaps an existing booking for this location',
        );
      });
  });
});
