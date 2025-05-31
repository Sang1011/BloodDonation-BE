import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Blood } from "src/bloods/schemas/blood.schema";
import { applySmartIdField } from "src/shared/middlewares/assign_custome_id.middleware";
import { User } from "src/users/schemas/user.schema";

export type InforHealthDocument = HydratedDocument<InforHealth>

@Schema()
export class InforHealth {
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
}

export const InforHealthSchema = SchemaFactory.createForClass(InforHealth);

// middleware
applySmartIdField(InforHealthSchema, InforHealth.name,'infor_health');