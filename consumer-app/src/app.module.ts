import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { SignalsModule } from './signals/signals.module';

@Module({
  imports: [
    // فعال کردن ConfigModule برای استفاده از .env
    ConfigModule.forRoot({
      isGlobal: true, // اینطوری تو همه جای پروژه بدون import اضافه قابل استفاده‌ست
    }),

    // اتصال به MongoDB
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/consumer-app',
    ),

    // ماژول RabbitMQ
    RabbitmqModule,

    SignalsModule,
  ],
})
export class AppModule {}
