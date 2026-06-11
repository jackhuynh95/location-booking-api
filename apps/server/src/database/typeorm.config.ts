import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { envValidationSchema } from '../config/env.validation';

type DatabaseEnv = {
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_SSL: boolean;
  DB_LOGGING: boolean;
};

const validationResult = envValidationSchema.validate(process.env, {
  abortEarly: false,
  allowUnknown: true,
});

if (validationResult.error) {
  throw validationResult.error;
}

const env = validationResult.value as DatabaseEnv;

export default new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  ssl: env.DB_SSL,
  synchronize: false,
  logging: env.DB_LOGGING,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
