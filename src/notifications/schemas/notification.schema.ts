import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { applySmartIdField } from 'src/shared/middlewares/assign_custome_id.middleware';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Notification {
  @Prop({ unique: true })
  notification_id: string;

  @Prop({ required: true, ref: 'User' })
  user_id: string; 

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ required: true })
  type: string; 

  @Prop({ default: false })
  is_read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
applySmartIdField(NotificationSchema, Notification.name ,'notification_id');