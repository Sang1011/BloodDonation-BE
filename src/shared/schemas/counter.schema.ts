import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Counter {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  seq: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);