import { Booking, BookingStatus } from './booking.entity';

export type BookingResponse = {
  id: string;
  locationId: string;
  department: string;
  attendeeCount: number;
  startAt: Date;
  endAt: Date;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
};

export const toBookingResponse = (booking: Booking): BookingResponse => ({
  id: booking.id,
  locationId: booking.locationId,
  department: booking.department,
  attendeeCount: booking.attendeeCount,
  startAt: booking.startAt,
  endAt: booking.endAt,
  status: booking.status,
  createdAt: booking.createdAt,
  updatedAt: booking.updatedAt,
});
