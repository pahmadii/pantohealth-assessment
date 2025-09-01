import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class XRay extends Document {
  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  time: number;

  @Prop()
  dataLength: number;

  @Prop()
  dataVolume: number;

  @Prop({ type: Array })
  data: Array<[number, [number, number, number]]>;
}

export const XRaySchema = SchemaFactory.createForClass(XRay);
