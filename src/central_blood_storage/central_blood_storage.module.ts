import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StorageModule } from "src/storages/storage.module";
import { CentralBloodModule } from "src/central_bloods/central_blood.module";
import { CentralStorageService } from "./central_blood_storage.service";
import { CentralStorageController } from "./central_blood_storage.controller";
import { CentralStorage, CentralStorageSchema } from "./schemas/central_blood_storage.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CentralStorage.name, schema: CentralStorageSchema },
    ]),
    StorageModule,
    CentralBloodModule
  ],
  controllers: [CentralStorageController],
  providers: [CentralStorageService],
  exports: [CentralStorageService]
})
export class CentralStorageModule {}