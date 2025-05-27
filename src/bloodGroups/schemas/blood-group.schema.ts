import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { bloodRhFactor, bloodTypes } from 'src/shared/enums/blood.enum';

export type BloodGroupDocument = HydratedDocument<BloodGroup>;

@Schema()
export class BloodGroup {
  @Prop({ enum: bloodTypes, required: true })
  bloodType: bloodTypes;

  @Prop({ enum: bloodRhFactor, required: true })
  rhFactor: bloodRhFactor;

  @Prop({ type: [String], enum: ["A-", "A+", "B-", "B+", "AB-", "AB+", "O-", "O+"], default: [] })
  canDonateTo: string[];

  @Prop({ type: [String], enum: ["A-", "A+", "B-", "B+", "AB-", "AB+", "O-", "O+"], default: [] })
  canReceiveFrom: string[];
}

export const BloodGroupSchema = SchemaFactory.createForClass(BloodGroup);
// không cần soft-delete vì không có trường nào cần xóa mềm
