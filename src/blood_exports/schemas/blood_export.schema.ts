import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { ReceiverBlood } from "src/receiver_bloods/schemas/receiver_blood.schema";
import { applySmartIdField } from "src/shared/middlewares/assign_custome_id.middleware";

export type BloodExportDocument = HydratedDocument<BloodExport>

@Schema()
export class BloodExport {
    @Prop({unique: true})
    export_id: string;

    @Prop({required: true, ref: Storage.name})
    storage_id: string;

    @Prop({required: true, ref: ReceiverBlood.name})
    receiver_id: string

    @Prop()
    export_date: Date;

    @Prop()
    status: string;
}

export const BloodExportSchema = SchemaFactory.createForClass(BloodExport);

// middleware
applySmartIdField(BloodExportSchema, BloodExport.name ,'export_id');
