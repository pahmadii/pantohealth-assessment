import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SignalsService } from './signals.service';
import { XRay, XRaySchema } from './schemas/xray.schema';
import { SignalsController } from './signals.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: XRay.name, schema: XRaySchema }]),
  ],
  providers: [SignalsService],
  exports: [SignalsService],
  controllers: [SignalsController],
})
export class SignalsModule {}
