export const databaseConfig = () => ({
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_DATABASE,
    ssl: process.env.DB_SSL === 'true',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    migrationsRun: process.env.DB_MIGRATIONS_RUN !== 'false',
    logging: process.env.DB_LOGGING === 'true',
    pool: {
      max: Number(process.env.DB_POOL_MAX ?? 10),
      idleTimeoutMillis: Number(process.env.DB_POOL_IDLE_TIMEOUT_MS ?? 30000),
      connectionTimeoutMillis: Number(
        process.env.DB_POOL_CONNECTION_TIMEOUT_MS ?? 5000,
      ),
    },
  },
});
