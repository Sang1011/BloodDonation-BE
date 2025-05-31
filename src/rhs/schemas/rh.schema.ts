import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { applySmartIdField } from 'src/shared/middlewares/assign_custome_id.middleware';

export type RhDocument = HydratedDocument<Rh>;

@Schema()
export class Rh {
  @Prop({unique: true})
  rh_id: number;

  @Prop({required: true})
  blood_Rh: string;
}

export const RhSchema = SchemaFactory.createForClass(Rh);

// middleware
applySmartIdField(RhSchema, Rh.name, 'rh_id');