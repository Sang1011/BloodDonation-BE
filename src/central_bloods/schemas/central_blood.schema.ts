import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { applySmartIdField } from "src/shared/middlewares/assign_custome_id.middleware";
import { WorkingHours } from "src/working_hours/schemas/working_hours.schema";

export type CentralBloodDocument = HydratedDocument<CentralBlood>
@Schema({ collection: 'central_bloods' })
export class CentralBlood {
    @Prop({ unique: true, required: true })
    centralBlood_id: number;

    @Prop({ required: true })
    centralBlood_name: string;

    @Prop({ required: true })
    centralBlood_address: string;

    @Prop({
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    })
    position: {
        type: 'Point';
        coordinates: [number, number];
    };

    @Prop({ ref: WorkingHours.name, required: true })
    working_id: string;
}

export const CentralBloodSchema = SchemaFactory.createForClass(CentralBlood);
CentralBloodSchema.index({ position: '2dsphere' })
// middleware
applySmartIdField(CentralBloodSchema, CentralBlood.name, 'centralBlood_id');