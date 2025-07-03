import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BloodType } from 'src/blood_types/schemas/blood_type.schema';
import { Rh } from 'src/rhs/schemas/rh.schema';
import { applySmartIdField } from 'src/shared/middlewares/assign_custome_id.middleware';
import { applySoftDeleteStatics } from 'src/shared/plugins/soft-delete.plugin';
import { BaseSchema } from 'src/shared/schemas/baseSchema';

export type BloodDocument = HydratedDocument<Blood>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Blood extends BaseSchema{
  @Prop({ unique: true })
  blood_id: string;
  
  @Prop({required: true, ref: BloodType.name})
  blood_type_id: number;

  @Prop({required: true, ref: Rh.name})
  rh_id: number;
}

export const BloodSchema = SchemaFactory.createForClass(Blood);

// middleware
applySmartIdField(BloodSchema, Blood.name ,'blood_id');
applySoftDeleteStatics(BloodSchema, 'blood_id'); 
