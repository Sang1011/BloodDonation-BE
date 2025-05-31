import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { applySmartIdField } from 'src/shared/middlewares/assign_custome_id.middleware';

export type BloodTypeDocument = HydratedDocument<BloodType>;

@Schema()
export class BloodType {
  @Prop({unique: true})
  blood_type: number;

  @Prop({required: true})
  blood_name: string;
}

export const BloodTypeSchema = SchemaFactory.createForClass(BloodType);

// middleware
applySmartIdField(BloodTypeSchema, BloodType.name ,'blood_type');
