import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Location } from 'src/locations/schemas/location.schema';
import { Role } from 'src/roles/schemas/role.schema';
import { applySmartIdField } from 'src/shared/middlewares/assign_custome_id.middleware';
import { applySoftDeleteStatics } from 'src/shared/plugins/soft-delete.plugin';
import { BaseSchema } from 'src/shared/schemas/baseSchema';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class User extends BaseSchema{
  @Prop({unique: true})
  user_id: string;

  @Prop({required: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({required: true})
  fullname: string;

  @Prop()
  phone: string;

  @Prop()
  dob: Date;

  @Prop({required: true, ref: Role.name})
  role_id: string;
  
  @Prop({required: true})
  gender: string;

  @Prop({required: true, ref: Location.name})
  location_id: string;

  @Prop({ select: false })
  refresh_token: string;

  @Prop()
  is_verified: boolean;

  @Prop()
  verify_token: string;

  @Prop({default: null, select: false})
  digit_code: string;

  @Prop({ default: null, select: false })
  digit_code_expire: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// middleware
applySmartIdField(UserSchema, User.name, 'user_id');
applySoftDeleteStatics(UserSchema, 'user_id');