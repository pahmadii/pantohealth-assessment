/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/await-thenable */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqp-connection-manager';
import { Channel } from 'amqplib';

@Injectable()
export class ProducerService implements OnModuleInit {
  private channel;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const connection = amqp.connect([this.configService.get('RABBITMQ_URL')]);
    this.channel = await connection.createChannel({
      setup: async (channel: Channel) => {
        await channel.assertQueue('xray-queue', { durable: true });
      },
    });
  }

  async sendXRayData(data: any) {
    await this.channel.sendToQueue(
      'xray-queue',
      Buffer.from(JSON.stringify(data)),
      {
        persistent: true,
      },
    );
  }
}
