/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { XRay } from './schemas/xray.schema';

@Injectable()
export class SignalsService {
  constructor(@InjectModel(XRay.name) private xrayModel: Model<XRay>) {}

  async create(xray: XRay): Promise<XRay> {
    return this.xrayModel.create(xray); // استفاده از create به جای new
  }

  async findAll(): Promise<XRay[]> {
    return this.xrayModel.find().exec();
  }

  async findOne(id: string): Promise<XRay> {
    return this.xrayModel.findById(id).exec();
  }

  async update(id: string, updateXRay: XRay): Promise<XRay> {
    return this.xrayModel
      .findByIdAndUpdate(id, updateXRay, { new: true })
      .exec();
  }

  async delete(id: string): Promise<any> {
    return this.xrayModel.findByIdAndDelete(id).exec();
  }

  async filter(deviceId: string, startTime: number): Promise<XRay[]> {
    const query: any = {};
    if (deviceId) query.deviceId = deviceId;
    if (startTime) query.time = { $gte: startTime };
    return this.xrayModel.find(query).exec();
  }

  async processXRayMessage(message: any): Promise<void> {
    try {
      const data = JSON.parse(message.content.toString());
      const deviceId = Object.keys(data)[0];
      const { time, data: xrayData } = data[deviceId];

      await this.xrayModel.create({
        deviceId,
        time,
        dataLength: xrayData.length,
        dataVolume: JSON.stringify(xrayData).length,
        data: xrayData,
      });
      console.log('📩 Received message from queue:', data);
    } catch (error) {
      console.error('Error processing x-ray data:', error);
      throw error;
    }
  }
}
