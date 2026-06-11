import { BadRequestException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { LocationsService } from './locations.service';

const date = new Date('2026-06-11T00:00:00.000Z');

type LocationSeed = Partial<Location> & {
  id: string;
  building?: string;
  name?: string;
  number?: string;
  parentId?: string | null;
};

const makeLocation = (seed: LocationSeed): Location => ({
  building: 'A',
  name: seed.name ?? seed.number ?? seed.id,
  number: seed.number ?? seed.id,
  department: null,
  capacity: null,
  openTime: null,
  isBookable: false,
  parentId: null,
  parent: null,
  children: [],
  bookings: [],
  createdAt: date,
  updatedAt: date,
  ...seed,
});

const createRepository = (initialLocations: Location[] = []) => {
  const records = new Map(
    initialLocations.map((location) => [location.id, location]),
  );

  const repository = {
    create: jest.fn((location: Partial<Location>) =>
      makeLocation({
        id: location.id ?? `location-${records.size + 1}`,
        ...location,
      }),
    ),
    save: jest.fn((location: Location) => {
      records.set(location.id, location);
      return Promise.resolve(location);
    }),
    find: jest.fn(() =>
      Promise.resolve(
        Array.from(records.values()).sort((a, b) =>
          a.number.localeCompare(b.number),
        ),
      ),
    ),
    findOne: jest.fn(({ where }: { where: Partial<Location> }) => {
      if (where.id !== undefined) {
        return Promise.resolve(records.get(where.id) ?? null);
      }

      if (where.number !== undefined) {
        return Promise.resolve(
          Array.from(records.values()).find(
            (location) => location.number === where.number,
          ) ?? null,
        );
      }

      return Promise.resolve(null);
    }),
    count: jest.fn(({ where }: { where: Partial<Location> }) =>
      Promise.resolve(
        Array.from(records.values()).filter(
          (location) => location.parentId === where.parentId,
        ).length,
      ),
    ),
    delete: jest.fn((id: string) => {
      records.delete(id);
      return Promise.resolve({ affected: 1 });
    }),
    records,
  };

  return repository as unknown as Repository<Location> & {
    records: Map<string, Location>;
  };
};

describe('LocationsService', () => {
  it('creates a child location when parent exists', async () => {
    const parent = makeLocation({ id: 'parent', number: 'A-01' });
    const repository = createRepository([parent]);
    const service = new LocationsService(repository);

    const location = await service.create({
      building: 'A',
      name: 'Meeting Room 1',
      number: 'A-01-01',
      parentId: parent.id,
    });

    expect(location.parentId).toBe(parent.id);
    expect(repository.records.get(location.id)?.number).toBe('A-01-01');
  });

  it('rejects create when parent does not exist', async () => {
    const service = new LocationsService(createRepository());

    await expect(
      service.create({
        building: 'A',
        name: 'Meeting Room 1',
        number: 'A-01-01',
        parentId: 'missing-parent',
      }),
    ).rejects.toThrow('Location missing-parent not found');
  });

  it('rejects parent updates that create cycles', async () => {
    const root = makeLocation({ id: 'root', number: 'A' });
    const floor = makeLocation({
      id: 'floor',
      number: 'A-01',
      parentId: root.id,
    });
    const room = makeLocation({
      id: 'room',
      number: 'A-01-01',
      parentId: floor.id,
    });
    const service = new LocationsService(createRepository([root, floor, room]));

    await expect(
      service.update(root.id, { parentId: room.id }),
    ).rejects.toThrow(BadRequestException);
  });

  it('builds nested tree output', async () => {
    const root = makeLocation({ id: 'root', number: 'A' });
    const floor = makeLocation({
      id: 'floor',
      number: 'A-01',
      parentId: root.id,
    });
    const room = makeLocation({
      id: 'room',
      number: 'A-01-01',
      parentId: floor.id,
    });
    const service = new LocationsService(createRepository([room, root, floor]));

    await expect(service.findTree()).resolves.toMatchObject([
      {
        id: root.id,
        children: [
          {
            id: floor.id,
            children: [{ id: room.id, children: [] }],
          },
        ],
      },
    ]);
  });

  it('rejects deleting a location with children', async () => {
    const root = makeLocation({ id: 'root', number: 'A' });
    const child = makeLocation({
      id: 'child',
      number: 'A-01',
      parentId: root.id,
    });
    const service = new LocationsService(createRepository([root, child]));

    await expect(service.remove(root.id)).rejects.toThrow(ConflictException);
  });

  it('deletes leaf locations', async () => {
    const leaf = makeLocation({ id: 'leaf', number: 'A-01-01' });
    const repository = createRepository([leaf]);
    const service = new LocationsService(repository);

    await service.remove(leaf.id);

    expect(repository.records.has(leaf.id)).toBe(false);
  });
});
