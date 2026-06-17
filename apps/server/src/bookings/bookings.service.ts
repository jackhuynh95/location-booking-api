import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  LessThan,
  MoreThan,
  Repository,
} from 'typeorm';
import { Location } from '../locations/location.entity';
import { Booking, BookingStatus } from './booking.entity';
import { BookingResponse, toBookingResponse } from './booking.types';
import { CreateBookingDto } from './dto/create-booking.dto';
import { isWithinOpenTime } from './open-time';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateBookingDto): Promise<BookingResponse> {
    const startAt = new Date(dto.startAt);
    const endAt = new Date(dto.endAt);

    if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
      throw new BadRequestException('Booking timestamps must be valid dates');
    }
    if (endAt <= startAt) {
      throw new BadRequestException('Booking endAt must be after startAt');
    }

    return this.dataSource.transaction(async (manager) => {
      const location = await this.getLocationForBookingOrThrow(
        manager,
        dto.locationId,
      );

      this.ensureLocationBookable(location);
      this.ensureDepartmentMatches(location, dto.department);
      this.ensureCapacityFits(location, dto.attendeeCount);
      this.ensureOpenTimeMatches(location, dto.startAt, dto.endAt);
      await this.ensureNoOverlap(manager, location.id, startAt, endAt);

      const booking = manager.create(Booking, {
        locationId: location.id,
        department: dto.department,
        attendeeCount: dto.attendeeCount,
        startAt,
        endAt,
        status: BookingStatus.CONFIRMED,
      });

      return toBookingResponse(await manager.save(booking));
    });
  }

  async findAll(): Promise<BookingResponse[]> {
    const bookings = await this.bookingsRepository.find({
      order: { startAt: 'ASC', createdAt: 'ASC' },
    });

    return bookings.map(toBookingResponse);
  }

  async findOne(id: string): Promise<BookingResponse> {
    return toBookingResponse(await this.getBookingOrThrow(id));
  }

  private async getBookingOrThrow(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Booking ${id} not found`);
    }

    return booking;
  }

  private async getLocationForBookingOrThrow(
    manager: EntityManager,
    id: string,
  ): Promise<Location> {
    const location = await manager.findOne(Location, {
      where: { id },
      lock: { mode: 'pessimistic_write' },
    });
    if (!location) {
      throw new NotFoundException(`Location ${id} not found`);
    }

    return location;
  }

  private ensureLocationBookable(location: Location): void {
    if (!location.isBookable) {
      throw new BadRequestException('Target location is not bookable');
    }
  }

  private ensureDepartmentMatches(
    location: Location,
    department: string,
  ): void {
    if (location.department !== department) {
      throw new BadRequestException(
        'Booking department does not match location department',
      );
    }
  }

  private ensureCapacityFits(location: Location, attendeeCount: number): void {
    if (location.capacity === null || attendeeCount > location.capacity) {
      throw new BadRequestException(
        'Booking attendee count exceeds location capacity',
      );
    }
  }

  private ensureOpenTimeMatches(
    location: Location,
    startAt: string,
    endAt: string,
  ): void {
    if (!isWithinOpenTime(location.openTime, startAt, endAt)) {
      throw new BadRequestException(
        'Booking time is outside location open time',
      );
    }
  }

  private async ensureNoOverlap(
    manager: EntityManager,
    locationId: string,
    startAt: Date,
    endAt: Date,
  ): Promise<void> {
    const existing = await manager.findOne(Booking, {
      where: {
        locationId,
        status: BookingStatus.CONFIRMED,
        startAt: LessThan(endAt),
        endAt: MoreThan(startAt),
      },
    });

    if (existing) {
      throw new ConflictException(
        'Booking overlaps an existing booking for this location',
      );
    }
  }
}
