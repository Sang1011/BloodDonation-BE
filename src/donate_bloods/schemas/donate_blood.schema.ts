import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Blood } from "src/bloods/schemas/blood.schema";
import { CentralBlood } from "src/central_bloods/schemas/central_blood.schema";
import { InforHealth } from "src/InforHealths/schemas/inforhealth.schema";
import { Status } from "src/shared/enums/status.enum";
import { applySmartIdField } from "src/shared/middlewares/assign_custome_id.middleware";

export type DonateBloodDocument = HydratedDocument<DonateBlood>

@Schema()
export class DonateBlood {
    @Prop({ unique: true })
    donate_id: string;

    @Prop({ required: true, ref: Blood.name })
    blood_id: string;

    @Prop({ required: true })
    date_register: Date;

    @Prop({ required: true })
    date_donate: Date;

    @Prop()
    ml: number;

    @Prop()
    unit: number;

    // @Prop()
    // status_regist: string;

    // @Prop()
    // status_donate: string;

    @Prop({ default: Status.PENDING })
    status_regist: Status;

    @Prop({ default: Status.PENDING })
    status_donate: Status;

    @Prop({ required: true, ref: InforHealth.name })
    infor_health: string;

    @Prop({ref: CentralBlood.name})
    centralBlood_id: number;
}

export const DonateBloodSchema = SchemaFactory.createForClass(DonateBlood);

// middleware
applySmartIdField(DonateBloodSchema, DonateBlood.name,'donate_id');