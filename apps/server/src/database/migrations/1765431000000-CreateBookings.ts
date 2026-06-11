import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBookings1765431000000 implements MigrationInterface {
  name = 'CreateBookings1765431000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."bookings_status_enum" AS ENUM('confirmed', 'cancelled')
    `);
    await queryRunner.query(`
      CREATE TABLE "bookings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "location_id" uuid NOT NULL,
        "department" character varying(80) NOT NULL,
        "attendee_count" integer NOT NULL,
        "start_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "end_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "status" "public"."bookings_status_enum" NOT NULL DEFAULT 'confirmed',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_bookings_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_bookings_attendee_count_positive" CHECK ("attendee_count" > 0),
        CONSTRAINT "CHK_bookings_end_after_start" CHECK ("end_at" > "start_at"),
        CONSTRAINT "FK_bookings_location_id" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "IDX_bookings_location_id" ON "bookings" ("location_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_bookings_start_at" ON "bookings" ("start_at")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_bookings_end_at" ON "bookings" ("end_at")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_bookings_status" ON "bookings" ("status")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_bookings_status"');
    await queryRunner.query('DROP INDEX "IDX_bookings_end_at"');
    await queryRunner.query('DROP INDEX "IDX_bookings_start_at"');
    await queryRunner.query('DROP INDEX "IDX_bookings_location_id"');
    await queryRunner.query('DROP TABLE "bookings"');
    await queryRunner.query('DROP TYPE "public"."bookings_status_enum"');
  }
}
