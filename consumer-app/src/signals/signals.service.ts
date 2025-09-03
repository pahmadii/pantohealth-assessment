/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { XRay } from './schemas/xray.schema';
import { CreateXRayDto } from './dto/create-xray.dto';

@Injectable()
export class SignalsService {
  private readonly logger = new Logger(SignalsService.name);

  constructor(@InjectModel(XRay.name) private xRayModel: Model<XRay>) {}

  async processXRayMessage(message: { content: Buffer } | null) {
    try {
      if (!message || !message.content) {
        throw new Error(
          'Invalid message: message or message.content is undefined',
        );
      }

      // 🟢 مرحله 1: parse message
      let rawData: any;
      try {
        rawData = JSON.parse(message.content.toString('utf8'));
        this.logger.debug(
          `Parsed message: ${JSON.stringify(rawData).substring(0, 200)}...`,
        );
      } catch (error) {
        this.logger.error(`Failed to parse message content: ${error.message}`);
        throw new Error(`Invalid JSON format: ${error.message}`);
      }

      // 🟢 مرحله 2: استخراج deviceId
      const deviceId = Object.keys(rawData)[0];
      if (!deviceId)
        throw new Error('Invalid x-ray data format: missing deviceId');

      const deviceData = rawData[deviceId];
      if (!deviceData || typeof deviceData.time !== 'number') {
        throw new Error('Invalid x-ray data format: missing time');
      }

      let { data, time } = deviceData;

      // 🟢 مرحله 3: اگر data استرینگ بود، parse کنیم
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          this.logger.error(`❌ Failed to parse data string: ${e.message}`);
          data = [];
        }
      }

      // 🟢 مرحله 4: اطمینان از آرایه بودن
      if (!Array.isArray(data)) {
        this.logger.warn(
          `X-ray data is not an array for device ${deviceId}, storing empty array.`,
        );
        data = [];
      }

      // 🟢 مرحله 5: فیلتر داده‌ها
      data = data.filter(
        (item: any) =>
          Array.isArray(item) &&
          item.length === 2 &&
          typeof item[0] === 'number' &&
          Array.isArray(item[1]) &&
          item[1].length === 3 &&
          item[1].every((val: any) => typeof val === 'number'),
      );

      const dataLength = data.length;
      const dataVolume = Buffer.from(JSON.stringify(data)).length;

      const xRayData: Partial<XRay> = {
        deviceId,
        time,
        dataLength,
        dataVolume,
        data,
      };

      const xRay = await this.xRayModel.create(xRayData);
      this.logger.log(
        `Processed and saved x-ray data for device ${deviceId} with ${dataLength} items`,
      );

      return xRay;
    } catch (error) {
      this.logger.error(`Error processing x-ray message: ${error.message}`);
      throw error;
    }
  }

  // 🟢 CRUD endpoints برای swagger و signals.controller.ts
  async create(xRay: CreateXRayDto) {
    try {
      const xRayData = {
        ...xRay,
        data: Array.isArray(xRay.data) ? xRay.data : [],
      };
      return await this.xRayModel.create(xRayData);
    } catch (error) {
      this.logger.error(`Error creating x-ray: ${error.message}`);
      throw error;
    }
  }

  async findAll() {
    return this.xRayModel.find().exec();
  }

  async findOne(id: string) {
    return this.xRayModel.findById(id).exec();
  }

  async update(id: string, xRay: CreateXRayDto) {
    const xRayData = {
      ...xRay,
      data: Array.isArray(xRay.data) ? xRay.data : [],
    };
    return this.xRayModel.findByIdAndUpdate(id, xRayData, { new: true }).exec();
  }

  async delete(id: string) {
    return this.xRayModel.findByIdAndDelete(id).exec();
  }

  async filter(deviceId?: string, startTime?: number) {
    const query: any = {};
    if (deviceId) query.deviceId = deviceId;
    if (startTime) query.time = { $gte: startTime };
    return this.xRayModel.find(query).exec();
  }
}
