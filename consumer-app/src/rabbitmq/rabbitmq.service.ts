import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqp-connection-manager';
import { Channel } from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit {
  private connection;
  private channel;

  constructor(private configService: ) {}

  async onModuleInit() {
    this.connection = amqp.connect([this.configService.get('RABBITMQ_URL')]);
    this.channel = await this.connection.createChannel({
      setup: async (channel: Channel) => {
        await channel.assertQueue('xray-queue', { durable: true });
        await channel.consume('xray-queue', (msg) => {
          if (msg) {
            console.log('Received:', msg.content.toString());
            // پردازش پیام اینجا میاد (بخش بعدی)
            channel.ack(msg);
          }
        });
      },
    });
  }
}