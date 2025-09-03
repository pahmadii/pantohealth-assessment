/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { SignalsService } from './signals.service';
import { getModelToken } from '@nestjs/mongoose';
import { XRay } from './schemas/xray.schema';
import mongoose from 'mongoose';

describe('SignalsService', () => {
  let service: SignalsService;
  let mockXRayModel: any;

  // نمونه داده برای تست
  const sampleXRay: Partial<XRay> = {
    _id: new mongoose.Types.ObjectId(),
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
    expect(mockXRayModel.create).toHaveBeenCalledWith(
      expect.objectContaining(sampleXRay),
    );
    expect(result).toEqual(sampleXRay);
  });

  it('should process x-ray message', async () => {
    const message = {
      content: Buffer.from(
        JSON.stringify({
          [sampleXRay.deviceId!]: {
            data: sampleXRay.data,
            time: sampleXRay.time,
          },
        }),
      ),
    };
    const result = await service.processXRayMessage(message);
    expect(mockXRayModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        deviceId: sampleXRay.deviceId,
        time: sampleXRay.time,
        dataLength: sampleXRay.dataLength,
        dataVolume: expect.any(Number),
        data: sampleXRay.data,
      }),
    );
    expect(result).toEqual(sampleXRay);
  });

  it('should find all x-ray documents', async () => {
    const result = await service.findAll();
    expect(mockXRayModel.find).toHaveBeenCalled();
    expect(result).toEqual([sampleXRay]);
  });

  it('should find one x-ray document by ID', async () => {
    const result = await service.findOne('123');
    expect(mockXRayModel.findById).toHaveBeenCalledWith('123');
    expect(result).toEqual(sampleXRay);
  });

  it('should update an x-ray document', async () => {
    const updateData: Partial<XRay> = { ...sampleXRay, dataLength: 301 };
    const result = await service.update('123', updateData as XRay);
    expect(mockXRayModel.findByIdAndUpdate).toHaveBeenCalledWith(
      '123',
      updateData,
      { new: true },
    );
    expect(result).toEqual(sampleXRay);
  });

  it('should delete an x-ray document', async () => {
    const result = await service.delete('123');
    expect(mockXRayModel.findByIdAndDelete).toHaveBeenCalledWith('123');
    expect(result).toBeNull();
  });

  it('should filter x-ray documents by deviceId and startTime', async () => {
    const result = await service.filter(
      '66bb584d4ae73e488c30a072',
      1735683480000,
    );
    expect(mockXRayModel.find).toHaveBeenCalledWith({
      deviceId: '66bb584d4ae73e488c30a072',
      time: { $gte: 1735683480000 },
    });
    expect(result).toEqual([sampleXRay]);
  });
});
