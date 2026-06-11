import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
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
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
  ) {}

  async create(dto: CreateBookingDto): Promise<BookingResponse> {
    const location = await this.getLocationOrThrow(dto.locationId);
    const startAt = new Date(dto.startAt);
    const endAt = new Date(dto.endAt);

    if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
      throw new BadRequestException('Booking timestamps must be valid dates');
    }
    if (endAt <= startAt) {
      throw new BadRequestException('Booking endAt must be after startAt');
    }

    this.ensureLocationBookable(location);
    this.ensureDepartmentMatches(location, dto.department);
    this.ensureCapacityFits(location, dto.attendeeCount);
    this.ensureOpenTimeMatches(location, dto.startAt, dto.endAt);
    await this.ensureNoOverlap(location.id, startAt, endAt);

    const booking = this.bookingsRepository.create({
      locationId: location.id,
      department: dto.department,
      attendeeCount: dto.attendeeCount,
      startAt,
      endAt,
      status: BookingStatus.CONFIRMED,
    });

    return toBookingResponse(await this.bookingsRepository.save(booking));
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

  private async getLocationOrThrow(id: string): Promise<Location> {
    const location = await this.locationsRepository.findOne({ where: { id } });
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
    locationId: string,
    startAt: Date,
    endAt: Date,
  ): Promise<void> {
    const existing = await this.bookingsRepository.findOne({
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
