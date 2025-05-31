import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { applySmartIdField } from "src/shared/middlewares/assign_custome_id.middleware";

export type CentralBloodDocument = HydratedDocument<CentralBlood>

@Schema()
export class CentralBlood {
    @Prop({unique: true})
    centralBlood_id: number

    @Prop({required: true})
    centralBlood_name: string

    @Prop({required: true})
    centralBlood_address: string

    @Prop({required: true, ref: Storage.name})
    storage_id: string;
}

export const CentralBloodSchema = SchemaFactory.createForClass(CentralBlood);

// middleware
applySmartIdField(CentralBloodSchema, CentralBlood.name,'centralBlood_id');