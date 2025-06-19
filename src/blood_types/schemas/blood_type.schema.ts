import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { applySmartIdField } from 'src/shared/middlewares/assign_custome_id.middleware';
import { applySoftDeleteStatics } from 'src/shared/plugins/soft-delete.plugin';
import { BaseSchema } from 'src/shared/schemas/baseSchema';

export type BloodTypeDocument = HydratedDocument<BloodType>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class BloodType extends BaseSchema {
  @Prop({unique: true})
  blood_type_id: number;

  @Prop({required: true})
  blood_name: string;
}

export const BloodTypeSchema = SchemaFactory.createForClass(BloodType);

// middleware
applySmartIdField(BloodTypeSchema, BloodType.name ,'blood_type_id');
applySoftDeleteStatics(BloodTypeSchema, 'blood_type_id'); 
