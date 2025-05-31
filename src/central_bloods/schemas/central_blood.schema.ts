import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { CentralBloodStorage } from "src/central_blood_storage/schemas/central_blood_storage.schema";
import { applySmartIdField } from "src/shared/middlewares/assign_custome_id.middleware";

export type CentralBloodDocument = HydratedDocument<CentralBlood>
@Schema({ collection: 'central_bloods' })
export class CentralBlood {
    @Prop({ unique: true, required: true })
    centralBlood_id: number;

    @Prop({ required: true })
    centralBlood_name: string;

    @Prop({ required: true })
    centralBlood_address: string;
}

export const CentralBloodSchema = SchemaFactory.createForClass(CentralBlood);

// middleware
applySmartIdField(CentralBloodSchema, CentralBlood.name, 'centralBlood_id');