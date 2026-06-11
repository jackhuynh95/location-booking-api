import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App as SupertestApp } from 'supertest/types';
import { LocationsController } from '../src/locations/locations.controller';
import { LocationsService } from '../src/locations/locations.service';

const timestamp = new Date('2026-06-11T00:00:00.000Z');
const id = '11111111-1111-4111-8111-111111111111';
const childId = '22222222-2222-4222-8222-222222222222';

const location = {
  id,
  building: 'A',
  name: 'Floor 1',
  number: 'A-01',
  department: null,
  capacity: null,
  openTime: null,
  isBookable: false,
  parentId: null,
  createdAt: timestamp,
  updatedAt: timestamp,
};

describe('LocationsController (e2e)', () => {
  let app: INestApplication;
  const service = {
    create: jest.fn(),
    findAll: jest.fn(),
    findTree: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [{ provide: LocationsService, useValue: service }],
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

  it('supports location CRUD and tree routes', async () => {
    const httpServer = app.getHttpServer() as SupertestApp;
    const created = { ...location, name: 'Meeting Room 1', isBookable: true };
    const tree = [
      {
        ...location,
        children: [
          {
            ...created,
            id: childId,
            parentId: id,
            children: [],
          },
        ],
      },
    ];

    service.create.mockResolvedValue(created);
    service.findAll.mockResolvedValue([location, created]);
    service.findOne.mockResolvedValue(created);
    service.findTree.mockResolvedValue(tree);
    service.update.mockResolvedValue({ ...created, name: 'Meeting Room 1A' });
    service.remove.mockResolvedValue(undefined);

    await request(httpServer)
      .post('/locations')
      .send({
        building: 'A',
        name: 'Meeting Room 1',
        number: 'A-01-01',
        isBookable: true,
        parentId: id,
      })
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        expect(body).toMatchObject({ name: 'Meeting Room 1' });
      });

    await request(httpServer)
      .get('/locations')
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toHaveLength(2);
      });

    await request(httpServer)
      .get('/locations/tree')
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toMatchObject([
          {
            children: [{ parentId: id }],
          },
        ]);
      });

    await request(httpServer)
      .get(`/locations/${childId}`)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toMatchObject({ id });
      });

    await request(httpServer)
      .patch(`/locations/${childId}`)
      .send({ name: 'Meeting Room 1A' })
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toMatchObject({ name: 'Meeting Room 1A' });
      });

    await request(httpServer)
      .delete(`/locations/${childId}`)
      .expect(HttpStatus.NO_CONTENT);

    expect(service.remove).toHaveBeenCalledWith(childId);
  });

  it('rejects invalid route UUIDs before service calls', async () => {
    const httpServer = app.getHttpServer() as SupertestApp;

    await request(httpServer)
      .get('/locations/not-a-uuid')
      .expect(HttpStatus.BAD_REQUEST);

    expect(service.findOne).not.toHaveBeenCalled();
  });
});
