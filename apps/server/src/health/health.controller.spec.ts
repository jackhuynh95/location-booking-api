import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  it('returns service health', () => {
    const healthService = {
      check: jest.fn().mockReturnValue({
        status: 'ok',
        database: 'up',
        timestamp: '2026-06-11T00:00:00.000Z',
      }),
    } as unknown as HealthService;
    const controller = new HealthController(healthService);

    expect(controller.check()).toEqual({
      status: 'ok',
      database: 'up',
      timestamp: '2026-06-11T00:00:00.000Z',
    });
  });
});
