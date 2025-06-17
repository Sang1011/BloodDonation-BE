import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { DayOfWeek } from 'src/shared/enums/working_hours.enum';
import { applySmartIdField } from 'src/shared/middlewares/assign_custome_id.middleware';
import { applySoftDeleteStatics } from 'src/shared/plugins/soft-delete.plugin';
import { BaseSchema } from 'src/shared/schemas/baseSchema';

export type WorkingHoursDocument = HydratedDocument<WorkingHours>;



@Schema({ collection: 'working_hours', timestamps: true })
export class WorkingHours extends BaseSchema {
  @Prop({ unique: true })
  working_id: string;

  @Prop({ required: true, enum: Object.values(DayOfWeek) })
  day_of_week: DayOfWeek;

  @Prop({ required: true, type: Date })
  open_time: Date;

  @Prop({ required: true, type: Date })
  close_time: Date;

  @Prop({ required: true, default: true })
  is_open: boolean;
}

export const WorkingHoursSchema = SchemaFactory.createForClass(WorkingHours);
applySoftDeleteStatics(WorkingHoursSchema, 'working_id'); 
applySmartIdField(WorkingHoursSchema, 'working_id');

