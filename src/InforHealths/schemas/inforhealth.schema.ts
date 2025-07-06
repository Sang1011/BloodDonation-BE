import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Blood } from "src/bloods/schemas/blood.schema";
import { applySmartIdField } from "src/shared/middlewares/assign_custome_id.middleware";
import { BaseSchema } from "src/shared/schemas/baseSchema";
import { applySoftDeleteStatics } from "src/shared/plugins/soft-delete.plugin";
import { User } from "src/users/schemas/user.schema";

export type InforHealthDocument = HydratedDocument<InforHealth>

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class InforHealth extends BaseSchema {
    @Prop({unique: true})
    infor_health: string;

    @Prop({required: true, ref: User.name})
    user_id: string;

    @Prop({required: true, ref: Blood.name})
    blood_id: string;

    @Prop()
    height: number;

    @Prop()
    weight_decimal: number;

    @Prop()
    blood_pressure: number;

    @Prop()
    medical_history: string;

    @Prop()
    latest_donate: Date;

    @Prop()
    status_health: string;

    @Prop()
    img_health: string;

    @Prop({default: false})
    is_regist_donate: boolean;

    @Prop({default: false})
    is_regist_receive: boolean;
}

export const InforHealthSchema = SchemaFactory.createForClass(InforHealth);

// middleware
applySmartIdField(InforHealthSchema, InforHealth.name,'infor_health');
applySoftDeleteStatics(InforHealthSchema, 'infor_health ');