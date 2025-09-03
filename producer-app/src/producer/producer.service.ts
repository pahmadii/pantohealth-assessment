/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, Logger } from '@nestjs/common';
import { connect, Channel } from 'amqplib';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProducerService {
  private readonly logger = new Logger(ProducerService.name);
  private channel: Channel;

  constructor(private configService: ConfigService) {
    this.initialize();
  }

  async initialize() {
    try {
      const connection = await connect(this.configService.get('RABBITMQ_URL'));

      this.channel = await connection.createChannel();
      await this.channel.assertQueue('xray-queue', { durable: true });
      this.logger.log('Connected to RabbitMQ and queue asserted');
    } catch (error) {
      this.logger.error(`Failed to initialize RabbitMQ: ${error.message}`);
      throw error;
    }
  }

  async sendXRayData() {
    try {
      // Load x-ray.json from file
      const rawData = fs.readFileSync('x-ray.json', 'utf8');
      const xRayData = JSON.parse(rawData);

      // Validate data
      if (
        !xRayData['66bb584d4ae73e488c30a072']?.data ||
        !Array.isArray(xRayData['66bb584d4ae73e488c30a072'].data)
      ) {
        throw new Error('Invalid x-ray data format');
      }

      const dataLength = xRayData['66bb584d4ae73e488c30a072'].data.length;
      // Send to RabbitMQ

      this.channel.sendToQueue(
        'xray-queue',
        Buffer.from(JSON.stringify(xRayData)),
        {
          persistent: true,
        },
      );
      this.logger.log(`Sent x-ray data with ${dataLength} items to queue`);
      return { message: `Data with ${dataLength} items sent to queue` };
    } catch (error) {
      this.logger.error(`Error sending x-ray data: ${error.message}`);
      throw error;
    }
  }
}
