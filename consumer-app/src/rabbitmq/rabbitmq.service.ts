/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable, OnModuleInit } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Channel, Connection } from 'amqplib';
import * as amqp from 'amqp-connection-manager';
import { SignalsService } from '../signals/signals.service';

@Injectable()
export class RabbitmqService implements OnModuleInit {
  private connection: amqp.AmqpConnectionManager;
  private channelWrapper: amqp.ChannelWrapper;

  constructor(private signalsService: SignalsService) {}

  async onModuleInit() {
    this.connection = amqp.connect(['amqp://localhost']); // آدرس RabbitMQ
    this.channelWrapper = this.connection.createChannel({
      json: false,
      setup: (channel: Channel) => {
        return channel.assertQueue('xray_queue', { durable: true });
      },
    });

    await this.channelWrapper.addSetup((channel: Channel) =>
      channel.consume('xray_queue', async (msg) => {
        if (msg) {
          await this.handleMessage(msg);
          channel.ack(msg);
        }
      }),
    );
  }

  // متد واقعی برای پردازش پیام‌ها
  async handleMessage(msg: any) {
    await this.signalsService.processXRayMessage(msg);
  }
}
