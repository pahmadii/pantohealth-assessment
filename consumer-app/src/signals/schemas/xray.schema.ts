import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop({ type: [[Number, [Number, Number, Number]]], required: true })
  data: [number, [number, number, number]][];
}

export const XRaySchema = SchemaFactory.createForClass(XRay);
