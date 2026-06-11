import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLocations1765430000000 implements MigrationInterface {
  name = 'CreateLocations1765430000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query(`
      CREATE TABLE "locations" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "building" character varying(120) NOT NULL,
        "name" character varying(160) NOT NULL,
        "number" character varying(80) NOT NULL,
        "department" character varying(80),
        "capacity" integer,
        "open_time" character varying(160),
        "is_bookable" boolean NOT NULL DEFAULT false,
        "parent_id" uuid,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_locations_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_locations_number" UNIQUE ("number"),
        CONSTRAINT "CHK_locations_capacity_positive" CHECK ("capacity" IS NULL OR "capacity" > 0),
        CONSTRAINT "FK_locations_parent_id" FOREIGN KEY ("parent_id") REFERENCES "locations"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "IDX_locations_building" ON "locations" ("building")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_locations_parent_id" ON "locations" ("parent_id")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_locations_parent_id"');
    await queryRunner.query('DROP INDEX "IDX_locations_building"');
    await queryRunner.query('DROP TABLE "locations"');
  }
}
