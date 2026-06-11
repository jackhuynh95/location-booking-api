import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Location } from '../locations/location.entity';

export enum BookingStatus {
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity({ name: 'bookings' })
@Check('"attendee_count" > 0')
@Check('"end_at" > "start_at"')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'location_id', type: 'uuid' })
  @Index()
  locationId!: string;

  @ManyToOne(() => Location, (location) => location.bookings, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'location_id' })
  location!: Location;

  @Column({ type: 'varchar', length: 80 })
  department!: string;

  @Column({ name: 'attendee_count', type: 'integer' })
  attendeeCount!: number;

  @Column({ name: 'start_at', type: 'timestamptz' })
  @Index()
  startAt!: Date;

  @Column({ name: 'end_at', type: 'timestamptz' })
  @Index()
  endAt!: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.CONFIRMED,
  })
  @Index()
  status!: BookingStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
