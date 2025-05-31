import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BloodType } from 'src/blood_types/schemas/blood_type.schema';
import { Rh } from 'src/rhs/schemas/rh.schema';
import { applySmartIdField } from 'src/shared/middlewares/assign_custome_id.middleware';

export type BloodDocument = HydratedDocument<Blood>;

@Schema()
export class Blood {
  @Prop({ unique: true })
  blood_id: string;

  // @Prop({required: true})
  // blood_name: string;

  @Prop({required: true, ref: BloodType.name})
  blood_type_id: number;

  @Prop({required: true, ref: Rh.name})
  rh_id: number;
}

export const BloodSchema = SchemaFactory.createForClass(Blood);

// middleware
applySmartIdField(BloodSchema, Blood.name ,'blood_id');
