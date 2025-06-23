import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { applySmartIdField } from 'src/shared/middlewares/assign_custome_id.middleware';
import { BaseSchema } from 'src/shared/schemas/baseSchema';

export type RhDocument = HydratedDocument<Rh>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Rh extends BaseSchema {
  @Prop({unique: true})
  rh_id: number;

  @Prop({required: true})
  blood_Rh: string;
}

export const RhSchema = SchemaFactory.createForClass(Rh);

// middleware
applySmartIdField(RhSchema, Rh.name, 'rh_id');
applySmartIdField(RhSchema, 'rh_id');