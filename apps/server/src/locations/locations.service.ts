import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './location.entity';
import {
  LocationResponse,
  LocationTreeNode,
  toLocationResponse,
} from './location.types';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
  ) {}

  async create(dto: CreateLocationDto): Promise<LocationResponse> {
    await this.ensureNumberAvailable(dto.number);

    if (dto.parentId !== undefined) {
      await this.getEntityOrThrow(dto.parentId);
    }

    const location = this.locationsRepository.create({
      building: dto.building,
      name: dto.name,
      number: dto.number,
      department: dto.department ?? null,
      capacity: dto.capacity ?? null,
      openTime: dto.openTime ?? null,
      isBookable: dto.isBookable ?? false,
      parentId: dto.parentId ?? null,
    });

    return toLocationResponse(await this.locationsRepository.save(location));
  }

  async findAll(): Promise<LocationResponse[]> {
    const locations = await this.findAllOrdered();
    return locations.map(toLocationResponse);
  }

  async findOne(id: string): Promise<LocationResponse> {
    return toLocationResponse(await this.getEntityOrThrow(id));
  }

  async findTree(): Promise<LocationTreeNode[]> {
    const locations = await this.findAllOrdered();
    const nodes = new Map<string, LocationTreeNode>();
    const roots: LocationTreeNode[] = [];

    for (const location of locations) {
      nodes.set(location.id, {
        ...toLocationResponse(location),
        children: [],
      });
    }

    for (const location of locations) {
      const node = nodes.get(location.id);

      if (!node) {
        continue;
      }

      if (location.parentId === null) {
        roots.push(node);
        continue;
      }

      const parent = nodes.get(location.parentId);
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  async update(id: string, dto: UpdateLocationDto): Promise<LocationResponse> {
    const location = await this.getEntityOrThrow(id);

    if (dto.number !== undefined && dto.number !== location.number) {
      await this.ensureNumberAvailable(dto.number, id);
      location.number = dto.number;
    }

    if (dto.parentId !== undefined && dto.parentId !== location.parentId) {
      await this.ensureValidParent(id, dto.parentId);
      location.parentId = dto.parentId;
    }

    if (dto.building !== undefined) {
      location.building = dto.building;
    }
    if (dto.name !== undefined) {
      location.name = dto.name;
    }
    if (dto.department !== undefined) {
      location.department = dto.department;
    }
    if (dto.capacity !== undefined) {
      location.capacity = dto.capacity;
    }
    if (dto.openTime !== undefined) {
      location.openTime = dto.openTime;
    }
    if (dto.isBookable !== undefined) {
      location.isBookable = dto.isBookable;
    }

    return toLocationResponse(await this.locationsRepository.save(location));
  }

  async remove(id: string): Promise<void> {
    await this.getEntityOrThrow(id);

    const childCount = await this.locationsRepository.count({
      where: { parentId: id },
    });
    if (childCount > 0) {
      throw new ConflictException(
        'Cannot delete a location that has child locations',
      );
    }

    await this.locationsRepository.delete(id);
  }

  private async findAllOrdered(): Promise<Location[]> {
    return this.locationsRepository.find({
      order: {
        building: 'ASC',
        number: 'ASC',
        name: 'ASC',
      },
    });
  }

  private async getEntityOrThrow(id: string): Promise<Location> {
    const location = await this.locationsRepository.findOne({ where: { id } });

    if (!location) {
      throw new NotFoundException(`Location ${id} not found`);
    }

    return location;
  }

  private async ensureNumberAvailable(
    number: string,
    currentId?: string,
  ): Promise<void> {
    const existing = await this.locationsRepository.findOne({
      where: { number },
    });

    if (existing && existing.id !== currentId) {
      throw new ConflictException(`Location number ${number} already exists`);
    }
  }

  private async ensureValidParent(
    locationId: string,
    parentId: string | null,
  ): Promise<void> {
    if (parentId === null) {
      return;
    }

    if (parentId === locationId) {
      throw new BadRequestException('A location cannot be its own parent');
    }

    let cursor = await this.getEntityOrThrow(parentId);
    while (cursor.parentId !== null) {
      if (cursor.parentId === locationId) {
        throw new BadRequestException(
          'A location cannot be moved under its descendant',
        );
      }
      cursor = await this.getEntityOrThrow(cursor.parentId);
    }
  }
}
