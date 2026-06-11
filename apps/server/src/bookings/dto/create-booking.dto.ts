import {
  IsInt,
  IsISO8601,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  locationId!: string;

  @IsString()
  @MaxLength(80)
  department!: string;

  @IsInt()
  @Min(1)
  attendeeCount!: number;

  @IsISO8601()
  startAt!: string;

  @IsISO8601()
  endAt!: string;
}
