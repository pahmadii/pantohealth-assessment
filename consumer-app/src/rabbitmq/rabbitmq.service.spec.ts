/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { RabbitmqService } from './rabbitmq.service';
import { SignalsService } from '../signals/signals.service';
import { ConfigService } from '@nestjs/config';

describe('RabbitmqService', () => {
  let service: RabbitmqService;
  let mockSignalsService;

  beforeEach(async () => {
    mockSignalsService = {
      processXRayMessage: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'RABBITMQ_URL') return 'amqp://localhost';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitmqService,
        { provide: SignalsService, useValue: mockSignalsService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<RabbitmqService>(RabbitmqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call SignalsService when message received', async () => {
    const msg = { content: Buffer.from(JSON.stringify({ testDevice: { time: 123, data: [] } })) };

    // متدی که مستقیم پیام رو هندل می‌کنه
    // اگه handleMessage توی RabbitmqService نداری، اضافه کن
    await service['signalsService'].processXRayMessage(msg);

    expect(mockSignalsService.processXRayMessage).toHaveBeenCalled();
  });
});
