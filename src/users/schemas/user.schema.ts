import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Location } from 'src/locations/schemas/location.schema';
import { Role } from 'src/roles/schemas/role.schema';
import { applySmartIdField } from 'src/shared/middlewares/assign_custome_id.middleware';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({unique: true})
  user_id: string;

  @Prop({required: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({required: true})
  fullname: string;

  @Prop({required: true, ref: Role.name})
  role_id: string;

  @Prop({required: true})
  gender: string;

  @Prop({required: true, ref: Location.name})
  location_id: string;

  @Prop()
  refresh_token: string;

  @Prop()
  is_verified: boolean;

  @Prop()
  verify_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// middleware
applySmartIdField(UserSchema, User.name, 'user_id');