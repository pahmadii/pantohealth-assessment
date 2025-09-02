/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { SignalsService } from './signals.service';
import { getModelToken } from '@nestjs/mongoose';
import { XRay } from './schemas/xray.schema';

describe('SignalsService', () => {
  let service: SignalsService;
  let mockXRayModel;

  const sampleXRay = {
    deviceId: '66bb584d4ae73e488c30a072',
    time: 1735683480000,
    dataLength: 3,
    dataVolume: 123,
    data: [
      [762, [51.339764, 12.339223833333334, 1.2038]],
      [1766, [51.33977733333333, 12.339211833333334, 1.531604]],
      [2763, [51.339782, 12.339196166666667, 2.13906]],
    ],
  };

  beforeEach(async () => {
    mockXRayModel = {
      create: jest.fn().mockResolvedValue(sampleXRay),
      find: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue([sampleXRay]) }),
      findById: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(sampleXRay) }),
      findByIdAndUpdate: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(sampleXRay) }),
      findByIdAndDelete: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignalsService,
        { provide: getModelToken(XRay.name), useValue: mockXRayModel },
      ],
    }).compile();

    service = module.get<SignalsService>(SignalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new x-ray document', async () => {
    const result = await service.create(sampleXRay as XRay);
    expect(mockXRayModel.create).toHaveBeenCalled();
    expect(result).toEqual(sampleXRay);
  });

  it('should process x-ray message', async () => {
    const message = {
      content: Buffer.from(
        JSON.stringify({ [sampleXRay.deviceId]: sampleXRay }),
      ),
    };
    await service.processXRayMessage(message);
    expect(mockXRayModel.create).toHaveBeenCalled();
  });
});
