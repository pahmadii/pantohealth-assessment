/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { XRay } from './schemas/xray.schema';
import { Channel } from 'amqplib';

@Injectable()
export class SignalsService {
  private readonly logger = new Logger(SignalsService.name);

  constructor(@InjectModel(XRay.name) private xRayModel: Model<XRay>) {}

  async processXRayMessage(message: { content: Buffer }) {
    try {
      const rawData = JSON.parse(message.content.toString());
      const deviceId = Object.keys(rawData)[0];
      const { data, time } = rawData[deviceId];

      // Validate data
      if (!deviceId || !data || !Array.isArray(data) || !time) {
        throw new Error('Invalid x-ray data format');
      }

      // Calculate dataLength and dataVolume
      const dataLength = data.length;
      const dataVolume = Buffer.from(JSON.stringify(data)).length;

      // Create x-ray document
      const xRayData = {
        deviceId,
        time,
        dataLength,
        dataVolume,
        data,
      };

      const xRay = await this.xRayModel.create(xRayData);
      this.logger.log(`Processed and saved x-ray data for device ${deviceId}`);
      return xRay;
    } catch (error) {
      this.logger.error(`Error processing x-ray message: ${error.message}`);
      throw error;
    }
  }

  async create(xRay: XRay) {
    try {
      return await this.xRayModel.create(xRay);
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

  async update(id: string, xRay: XRay) {
    return this.xRayModel.findByIdAndUpdate(id, xRay, { new: true }).exec();
  }

  async delete(id: string) {
    return this.xRayModel.findByIdAndDelete(id).exec();
  }

  async filter(deviceId: string, startTime: number) {
    const query: any = {};
    if (deviceId) query.deviceId = deviceId;
    if (startTime) query.time = { $gte: startTime };
    return this.xRayModel.find(query).exec();
  }
}
