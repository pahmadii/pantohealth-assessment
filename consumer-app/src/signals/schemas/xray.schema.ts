import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class XRay extends Document {
  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  time: number;

  @Prop({ required: true })
  dataLength: number;

  @Prop({ required: true })
  dataVolume: number;

  // ❌ دیگه type: [[Number, [Number, Number, Number]]] استفاده نکن
  // ✅ بذار Mixed باشه، تا mongoose گیر نده
  @Prop({ type: [MongooseSchema.Types.Mixed], required: true })
  data: any[];
}

export const XRaySchema = SchemaFactory.createForClass(XRay);
