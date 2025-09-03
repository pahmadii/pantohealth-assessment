/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, Channel } from 'amqplib';
import { SignalsService } from '../signals/signals.service';

@Injectable()
export class RabbitmqService {
  private readonly logger = new Logger(RabbitmqService.name);
  private channel: Channel;

  constructor(
    private configService: ConfigService,
    private signalsService: SignalsService,
  ) {
    this.initialize();
  }

  async initialize() {
    const rabbitmqUrl =
      this.configService.get('RABBITMQ_URL') || 'amqp://localhost';
    const connection = await connect(rabbitmqUrl);
    this.channel = await connection.createChannel();
    await this.channel.assertQueue('xray-queue', { durable: true });
    this.logger.log('Connected to RabbitMQ');
    this.consumeMessages();
  }

  async consumeMessages() {
    await this.channel.consume(
      'xray-queue',
      async (msg) => {
        if (!msg) return;
        try {
          await this.signalsService.processXRayMessage(msg);
          this.channel.ack(msg);
          this.logger.log('📩 Message processed');
        } catch (err) {
          this.logger.error(`❌ Failed: ${err.message}`);
          this.channel.nack(msg, false, false);
        }
      },
      { noAck: false },
    );
  }
}
