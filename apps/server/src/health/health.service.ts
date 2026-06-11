import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(private readonly dataSource: DataSource) {}

  check() {
    return {
      status: 'ok',
      database: this.dataSource.isInitialized ? 'up' : 'down',
      timestamp: new Date().toISOString(),
    };
  }
}
