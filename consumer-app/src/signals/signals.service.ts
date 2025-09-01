/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { XRay } from './schemas/xray.schema';

@Injectable()
export class SignalsService {
  constructor(@InjectModel(XRay.name) private xrayModel: Model<XRay>) {}

  // متد پردازش پیام RabbitMQ
  async processXRayMessage(message: any): Promise<void> {
    try {
      const data = JSON.parse(message.content.toString());
      const deviceId = Object.keys(data)[0];
      const { time, data: xrayData } = data[deviceId];
      const dataLength = xrayData.length;
      const dataVolume = JSON.stringify(xrayData).length; // تقریبی برای حجم

      const xray = new this.xrayModel({
        deviceId,
        time,
        dataLength,
        dataVolume,
        data: xrayData,
      });
      await xray.save();
    } catch (error) {
      console.error('Error processing x-ray data:', error);
      throw error;
    }
  }

  // CRUD Methods

  async create(xray: XRay): Promise<XRay> {
    const newXRay = new this.xrayModel(xray);
    return newXRay.save();
  }

  async findAll(): Promise<XRay[]> {
    return this.xrayModel.find().exec();
  }

  async findOne(id: string): Promise<XRay | null> {
    return this.xrayModel.findById(id).exec();
  }

  async update(id: string, updateXRay: XRay): Promise<XRay | null> {
    return this.xrayModel
      .findByIdAndUpdate(id, updateXRay, { new: true })
      .exec();
  }

  async delete(id: string): Promise<any> {
    return this.xrayModel.findByIdAndDelete(id).exec();
  }

  async filter(deviceId: string, startTime: number): Promise<XRay[]> {
    const query: any = {};
    if (deviceId) query['deviceId'] = deviceId;
    if (startTime) query['time'] = { $gte: startTime };
    return this.xrayModel.find(query).exec();
  }
}
