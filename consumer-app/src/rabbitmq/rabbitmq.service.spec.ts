/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { RabbitmqService } from './rabbitmq.service';
import { SignalsService } from '../signals/signals.service';

describe('RabbitmqService', () => {
  let service: RabbitmqService;
  let mockSignalsService;

  beforeEach(async () => {
    mockSignalsService = {
      processXRayMessage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitmqService,
        { provide: SignalsService, useValue: mockSignalsService },
      ],
    }).compile();

    service = module.get<RabbitmqService>(RabbitmqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call SignalsService when message received', async () => {
    const msg = { content: Buffer.from(JSON.stringify({ test: 'data' })) };
    await service.handleMessage(msg); // استفاده از متد واقعی
    expect(mockSignalsService.processXRayMessage).toHaveBeenCalled();
  });
});
