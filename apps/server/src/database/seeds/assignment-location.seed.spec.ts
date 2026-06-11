import { Repository } from 'typeorm';
import { Location } from '../../locations/location.entity';
import {
  assignmentLocationSeeds,
  inferParentLocationNumber,
  seedAssignmentLocations,
} from './assignment-location.seed';

const date = new Date('2026-06-11T00:00:00.000Z');

const makeLocation = (id: string): Location => ({
  id,
  building: '',
  name: '',
  number: '',
  department: null,
  capacity: null,
  openTime: null,
  isBookable: false,
  parentId: null,
  parent: null,
  children: [],
  createdAt: date,
  updatedAt: date,
});

const createRepository = () => {
  const records = new Map<string, Location>();
  let nextId = 1;

  const repository = {
    create: jest.fn(() => makeLocation(`location-${nextId++}`)),
    findOne: jest.fn(({ where }: { where: Partial<Location> }) => {
      if (where.number === undefined) {
        return Promise.resolve(null);
      }

      return Promise.resolve(records.get(where.number) ?? null);
    }),
    save: jest.fn((location: Location) => {
      records.set(location.number, location);
      return Promise.resolve(location);
    }),
    records,
  };

  return repository as unknown as Repository<Location> & {
    records: Map<string, Location>;
  };
};

describe('assignment location seed', () => {
  it('preserves the assignment table values exactly', () => {
    expect(assignmentLocationSeeds).toEqual([
      {
        building: 'A',
        name: 'Floor 1',
        number: 'A-01',
        department: null,
        capacity: null,
        openTime: null,
      },
      {
        building: 'A',
        name: 'Lobby Level1',
        number: 'A-01-Lobby',
        department: null,
        capacity: null,
        openTime: null,
      },
      {
        building: 'A',
        name: 'Meeting Room 1',
        number: 'A-01-01',
        department: 'EFM',
        capacity: 10,
        openTime: 'Mon to Fri (9AM to 6PM)',
      },
      {
        building: 'A',
        name: 'Meeting Room 2',
        number: 'A-01-02',
        department: 'FSS',
        capacity: 50,
        openTime: 'Mon to Fri (9AM to 6PM)',
      },
      {
        building: 'A',
        name: 'Corridor Floor 1',
        number: 'A-01-Corridor',
        department: null,
        capacity: null,
        openTime: null,
      },
      {
        building: 'A',
        name: 'Meeting Room 2',
        number: 'A-01-03',
        department: 'AVS',
        capacity: 5,
        openTime: 'Mon to Sat (9AM to 6PM)',
      },
      {
        building: 'B',
        name: 'Floor 5',
        number: 'B-05',
        department: null,
        capacity: null,
        openTime: null,
      },
      {
        building: 'B',
        name: 'Utility Room',
        number: 'B-05-11',
        department: 'ASS',
        capacity: 30,
        openTime: 'Always open',
      },
      {
        building: 'B',
        name: 'Sanitary Room',
        number: 'B-05-12',
        department: 'EFM',
        capacity: 10,
        openTime: 'Mon to Fri (9AM to 6PM)',
      },
      {
        building: 'B',
        name: 'Meeting Toilet',
        number: 'B-05-13',
        department: 'EFM',
        capacity: 10,
        openTime: 'Mon to Fri (9AM to 6PM)',
      },
      {
        building: 'B',
        name: 'Genset Room',
        number: 'B-05-14',
        department: 'ASS',
        capacity: 100,
        openTime: 'Mon to Sun (9AM to 6PM)',
      },
      {
        building: 'B',
        name: 'Pantry Floor 5',
        number: 'B-05-15',
        department: null,
        capacity: null,
        openTime: null,
      },
      {
        building: 'B',
        name: 'Corridor Floor 5',
        number: 'B-05-Corridor',
        department: null,
        capacity: null,
        openTime: null,
      },
    ]);
  });

  it('infers parent numbers from assignment location numbers', () => {
    expect(inferParentLocationNumber('A-01')).toBeNull();
    expect(inferParentLocationNumber('A-01-01')).toBe('A-01');
    expect(inferParentLocationNumber('A-01-Corridor')).toBe('A-01');
    expect(inferParentLocationNumber('B-05-14')).toBe('B-05');
  });

  it('creates parent-child hierarchy and can rerun without duplicates', async () => {
    const repository = createRepository();

    await expect(seedAssignmentLocations(repository)).resolves.toEqual({
      inserted: 13,
      updated: 0,
      total: 13,
    });
    await expect(seedAssignmentLocations(repository)).resolves.toEqual({
      inserted: 0,
      updated: 13,
      total: 13,
    });

    expect(repository.records.size).toBe(13);
    expect(repository.records.get('A-01-01')).toMatchObject({
      building: 'A',
      name: 'Meeting Room 1',
      department: 'EFM',
      capacity: 10,
      openTime: 'Mon to Fri (9AM to 6PM)',
      isBookable: true,
      parentId: repository.records.get('A-01')?.id,
    });
    expect(repository.records.get('B-05-Corridor')).toMatchObject({
      building: 'B',
      name: 'Corridor Floor 5',
      department: null,
      capacity: null,
      openTime: null,
      isBookable: false,
      parentId: repository.records.get('B-05')?.id,
    });
  });
});
