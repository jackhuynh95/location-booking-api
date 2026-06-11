import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { BookingResponse } from './booking.types';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() dto: CreateBookingDto): Promise<BookingResponse> {
    return this.bookingsService.create(dto);
  }

  @Get()
  findAll(): Promise<BookingResponse[]> {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<BookingResponse> {
    return this.bookingsService.findOne(id);
  }
}
