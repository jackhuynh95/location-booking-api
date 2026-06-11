import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ConfigService } from '@nestjs/config';
import { Response, static as serveStatic } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
  });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  const adminRoot = join(process.cwd(), 'public', 'admin');
  if (existsSync(adminRoot)) {
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.use('/admin', serveStatic(adminRoot));
    httpAdapter.get('/admin', (_request: unknown, response: Response) => {
      response.sendFile(join(adminRoot, 'index.html'));
    });
    httpAdapter.get('/admin/*path', (_request: unknown, response: Response) => {
      response.sendFile(join(adminRoot, 'index.html'));
    });
  }

  const config = app.get(ConfigService);
  await app.listen(config.getOrThrow<number>('app.port'));
}
void bootstrap();
