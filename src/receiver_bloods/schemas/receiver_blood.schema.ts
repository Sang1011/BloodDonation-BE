import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Blood } from "src/bloods/schemas/blood.schema";
import { InforHealth } from "src/InforHealths/schemas/inforhealth.schema";
import { Status } from "src/shared/enums/status.enum";
import { applySmartIdField } from "src/shared/middlewares/assign_custome_id.middleware";
import { applySoftDeleteStatics } from "src/shared/plugins/soft-delete.plugin";
import { BaseSchema } from "src/shared/schemas/baseSchema";
import { User } from "src/users/schemas/user.schema";
import { CentralBlood } from "src/central_bloods/schemas/central_blood.schema";

export type ReceiverBloodDocument = HydratedDocument<ReceiverBlood>

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class ReceiverBlood extends BaseSchema {
    @Prop({unique: true})
    receiver_id: string;

    @Prop({required: true, ref: Blood.name})
    blood_id: string;

    @Prop({required: true, default: new Date()})
    date_register: Date;

    @Prop({required: true})
    date_receiver: Date;

    @Prop({required: true})
    ml: number;

    @Prop({required: true})
    unit: number;

    @Prop({ required: true, enum: ['EMERGENCY', 'DEFAULT'] })
    type: 'EMERGENCY' | 'DEFAULT';

    @Prop({ default: Status.PENDING })
    status_regist: Status;
    
    @Prop({ default: Status.PENDING })
    status_receive: Status;

    // @Prop({required: true, ref: InforHealth.name})
    // infor_health: string;

    @Prop({required: true, ref: User.name})
    user_id: string;

    @Prop({required: true, ref: CentralBlood.name})
    centralBlood_id: number;


}

export const ReceiverBloodSchema = SchemaFactory.createForClass(ReceiverBlood);

// middleware
applySmartIdField(ReceiverBloodSchema, ReceiverBlood.name,'receiver_id');
applySoftDeleteStatics(ReceiverBloodSchema, 'receiver_id');