import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { applySmartIdField } from 'src/shared/middlewares/assign_custome_id.middleware';
import { applySoftDeleteStatics } from 'src/shared/plugins/soft-delete.plugin';
import { BaseSchema } from 'src/shared/schemas/baseSchema';

export type RoleDocument = HydratedDocument<Role>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Role extends BaseSchema {
  @Prop({unique: true})
  role_id: string;
  
  @Prop()
  role_name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

// middleware
applySmartIdField(RoleSchema, Role.name, 'role_id');
applySoftDeleteStatics(RoleSchema, 'role_id'); 