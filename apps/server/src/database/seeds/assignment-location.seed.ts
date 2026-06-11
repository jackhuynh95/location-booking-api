import { Repository } from 'typeorm';
import { Location } from '../../locations/location.entity';

export type AssignmentLocationSeed = {
  building: string;
  name: string;
  number: string;
  department: string | null;
  capacity: number | null;
  openTime: string | null;
};

export type SeedAssignmentLocationsResult = {
  inserted: number;
  updated: number;
  total: number;
};

export const assignmentLocationSeeds: AssignmentLocationSeed[] = [
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
];

export const inferParentLocationNumber = (number: string): string | null => {
  const segments = number.split('-');
  if (segments.length <= 2) {
    return null;
  }

  return segments.slice(0, -1).join('-');
};

const isBookableSeed = (seed: AssignmentLocationSeed): boolean =>
  seed.department !== null && seed.capacity !== null && seed.openTime !== null;

const compareByHierarchyDepth = (
  left: AssignmentLocationSeed,
  right: AssignmentLocationSeed,
): number =>
  left.number.split('-').length - right.number.split('-').length ||
  left.number.localeCompare(right.number);

export const seedAssignmentLocations = async (
  repository: Repository<Location>,
): Promise<SeedAssignmentLocationsResult> => {
  let inserted = 0;
  let updated = 0;

  const byNumber = new Map<string, Location>();
  const orderedSeeds = [...assignmentLocationSeeds].sort(
    compareByHierarchyDepth,
  );

  for (const seed of orderedSeeds) {
    const parentNumber = inferParentLocationNumber(seed.number);
    const parent = parentNumber ? byNumber.get(parentNumber) : null;
    const existing = await repository.findOne({
      where: { number: seed.number },
    });
    const location = existing ?? repository.create();

    location.building = seed.building;
    location.name = seed.name;
    location.number = seed.number;
    location.department = seed.department;
    location.capacity = seed.capacity;
    location.openTime = seed.openTime;
    location.isBookable = isBookableSeed(seed);
    location.parentId = parent?.id ?? null;

    const saved = await repository.save(location);
    byNumber.set(saved.number, saved);

    if (existing) {
      updated += 1;
    } else {
      inserted += 1;
    }
  }

  return {
    inserted,
    updated,
    total: assignmentLocationSeeds.length,
  };
};
