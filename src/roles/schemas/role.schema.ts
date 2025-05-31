import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { applySmartIdField } from 'src/shared/middlewares/assign_custome_id.middleware';

export type RoleDocument = HydratedDocument<Role>;

@Schema()
export class Role {
  @Prop({unique: true})
  role_id: string;
  
  @Prop()
  role_name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

// middleware
applySmartIdField(RoleSchema, Role.name, 'role_id');