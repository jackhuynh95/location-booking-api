import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'locations' })
@Check('"capacity" IS NULL OR "capacity" > 0')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  @Index()
  building!: string;

  @Column({ type: 'varchar', length: 160 })
  name!: string;

  @Column({ type: 'varchar', length: 80, unique: true })
  number!: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  department!: string | null;

  @Column({ type: 'integer', nullable: true })
  capacity!: number | null;

  @Column({ name: 'open_time', type: 'varchar', length: 160, nullable: true })
  openTime!: string | null;

  @Column({ name: 'is_bookable', type: 'boolean', default: false })
  isBookable!: boolean;

  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  @Index()
  parentId!: string | null;

  @ManyToOne(() => Location, (location) => location.children, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'parent_id' })
  parent!: Location | null;

  @OneToMany(() => Location, (location) => location.parent)
  children!: Location[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
