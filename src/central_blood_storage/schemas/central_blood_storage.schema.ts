import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CentralBlood } from 'src/central_bloods/schemas/central_blood.schema';
import { applySmartIdField } from 'src/shared/middlewares/assign_custome_id.middleware';
import { Storage } from 'src/storages/schemas/storage.schema';

export type CentralBloodStorageDocument = HydratedDocument<CentralBloodStorage>;

@Schema({ collection: "central_blood_storages"})
export class CentralBloodStorage {
    @Prop({ unique: true })
    centralStorage_id: number;

    @Prop({ required: true, ref: CentralBlood.name })
    centralBlood_id: number

    @Prop({ required: true, ref: Storage.name })
    storage_id: string;
}

export const CentralBloodStorageSchema = SchemaFactory.createForClass(CentralBloodStorage);

// middleware
applySmartIdField(CentralBloodStorageSchema, CentralBloodStorage.name, 'centralStorage_id');