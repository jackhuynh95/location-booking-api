import { Location } from './location.entity';

export type LocationResponse = {
  id: string;
  building: string;
  name: string;
  number: string;
  department: string | null;
  capacity: number | null;
  openTime: string | null;
  isBookable: boolean;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type LocationTreeNode = LocationResponse & {
  children: LocationTreeNode[];
};

export const toLocationResponse = (location: Location): LocationResponse => ({
  id: location.id,
  building: location.building,
  name: location.name,
  number: location.number,
  department: location.department,
  capacity: location.capacity,
  openTime: location.openTime,
  isBookable: location.isBookable,
  parentId: location.parentId,
  createdAt: location.createdAt,
  updatedAt: location.updatedAt,
});
