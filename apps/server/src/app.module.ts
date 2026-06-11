import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppConfigModule } from './config/app-config.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { RequestLoggingMiddleware } from './common/logging/request-logging.middleware';
import { LocationsModule } from './locations/locations.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    HealthModule,
    LocationsModule,
    BookingsModule,
  ],
  providers: [RequestLoggingMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
