import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('database.host'),
        port: config.getOrThrow<number>('database.port'),
        username: config.getOrThrow<string>('database.username'),
        password: config.getOrThrow<string>('database.password'),
        database: config.getOrThrow<string>('database.name'),
        ssl: config.getOrThrow<boolean>('database.ssl'),
        autoLoadEntities: true,
        synchronize: config.getOrThrow<boolean>('database.synchronize'),
        migrationsRun: config.getOrThrow<boolean>('database.migrationsRun'),
        logging: config.getOrThrow<boolean>('database.logging'),
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        extra: {
          max: config.getOrThrow<number>('database.pool.max'),
          idleTimeoutMillis: config.getOrThrow<number>(
            'database.pool.idleTimeoutMillis',
          ),
          connectionTimeoutMillis: config.getOrThrow<number>(
            'database.pool.connectionTimeoutMillis',
          ),
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
