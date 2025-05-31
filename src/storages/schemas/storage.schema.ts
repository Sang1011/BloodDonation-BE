import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Blood } from "src/bloods/schemas/blood.schema";
import { CentralBlood } from "src/central_bloods/schemas/central_blood.schema";
import { DonateBlood } from "src/donate_bloods/schemas/donate_blood.schema";
import { applySmartIdField } from "src/shared/middlewares/assign_custome_id.middleware";

export type StorageDocument = HydratedDocument<Storage>

@Schema()
export class Storage {
    @Prop({unique: true})
    storage_id: string;

    @Prop({required: true, ref: DonateBlood.name})
    donate_id: string;

    @Prop({required: true, ref: Blood.name})
    blood_id: string;

    @Prop({required: true})
    date: Date;

    @Prop({required: true})
    ml: number;

    @Prop({required: true})
    unit: number;

    @Prop({required: true})
    expired_date: Date;

    @Prop({required: true})
    current_status: string;

    @Prop({required: true, ref: CentralBlood.name})
    centralBlood_id: number;
}

export const StorageSchema = SchemaFactory.createForClass(Storage);

// middleware
applySmartIdField(StorageSchema, Storage.name,'storage_id');