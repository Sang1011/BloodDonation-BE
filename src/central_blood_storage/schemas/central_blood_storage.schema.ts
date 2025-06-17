import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CentralBlood } from 'src/central_bloods/schemas/central_blood.schema';
import { applySmartIdField } from 'src/shared/middlewares/assign_custome_id.middleware';
import { applySoftDeleteStatics } from 'src/shared/plugins/soft-delete.plugin';
import { BaseSchema } from 'src/shared/schemas/baseSchema';
import { Storage } from 'src/storages/schemas/storage.schema';

export type CentralStorageDocument = HydratedDocument<CentralStorage>;

@Schema({ collection: "central_storages"})
export class CentralStorage extends BaseSchema{
    @Prop({ unique: true })
    centralStorage_id: number;

    @Prop({ required: true, ref: CentralBlood.name })
    centralBlood_id: number

    @Prop({ required: true, ref: Storage.name })
    storage_id: string;
}

export const CentralStorageSchema = SchemaFactory.createForClass(CentralStorage);

// middleware
applySmartIdField(CentralStorageSchema, CentralStorage.name, 'centralStorage_id');
applySoftDeleteStatics(CentralStorageSchema, 'centralStorage_id');