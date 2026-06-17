import 'reflect-metadata';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { DataSource } from 'typeorm';
import { envValidationSchema } from '../config/env.validation';

loadEnv({ path: resolve(process.cwd(), '../../.env') });
loadEnv({ path: resolve(process.cwd(), '.env'), override: true });

type DatabaseEnv = {
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_SSL: boolean;
  DB_LOGGING: boolean;
  DB_POOL_MAX: number;
  DB_POOL_IDLE_TIMEOUT_MS: number;
  DB_POOL_CONNECTION_TIMEOUT_MS: number;
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
  extra: {
    max: env.DB_POOL_MAX,
    idleTimeoutMillis: env.DB_POOL_IDLE_TIMEOUT_MS,
    connectionTimeoutMillis: env.DB_POOL_CONNECTION_TIMEOUT_MS,
  },
});
