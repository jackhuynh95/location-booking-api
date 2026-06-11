import dataSource from '../typeorm.config';
import { Location } from '../../locations/location.entity';
import { seedAssignmentLocations } from './assignment-location.seed';

const run = async (): Promise<void> => {
  await dataSource.initialize();

  try {
    const result = await seedAssignmentLocations(
      dataSource.getRepository(Location),
    );
    console.log(
      `Seeded assignment locations: ${result.inserted} inserted, ${result.updated} updated, ${result.total} total.`,
    );
  } finally {
    await dataSource.destroy();
  }
};

void run().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
