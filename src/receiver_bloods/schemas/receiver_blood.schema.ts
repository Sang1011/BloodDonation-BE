import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Blood } from "src/bloods/schemas/blood.schema";
import { InforHealth } from "src/InforHealths/schemas/inforhealth.schema";
import { applySmartIdField } from "src/shared/middlewares/assign_custome_id.middleware";
import { User } from "src/users/schemas/user.schema";

export type ReceiverBloodDocument = HydratedDocument<ReceiverBlood>

@Schema()
export class ReceiverBlood {
    @Prop({unique: true})
    receiver_id: string;

    @Prop({required: true, ref: Blood.name})
    blood_id: string;

    @Prop({required: true})
    date_register: Date;

    @Prop({required: true})
    date_receiver: Date;

    @Prop({required: true})
    ml: number;

    @Prop({required: true})
    unit: number;

    @Prop({ required: true, enum: ['EMERGENCY', 'DEFAULT'], default: 'DEFAULT' })
    type: 'EMERGENCY' | 'DEFAULT';

    @Prop()
    status_regist: string;

    @Prop()
    status_receiver: string;

    @Prop({required: true, ref: InforHealth.name})
    infor_health: string;
    
}

export const ReceiverBloodSchema = SchemaFactory.createForClass(ReceiverBlood);

// middleware
applySmartIdField(ReceiverBloodSchema, ReceiverBlood.name,'receiver_id');