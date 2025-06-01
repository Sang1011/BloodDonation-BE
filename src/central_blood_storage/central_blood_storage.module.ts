import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CentralBloodStorage, CentralBloodStorageSchema } from "./schemas/central_blood_storage.schema";
import { CentralBloodStorageController } from "./central_blood_storage.controller";
import { CentralBloodStorageService } from "./central_blood_storage.service";
import { StorageModule } from "src/storages/storage.module";
import { CentralBloodModule } from "src/central_bloods/central_blood.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CentralBloodStorage.name, schema: CentralBloodStorageSchema }, 
    ]), StorageModule, CentralBloodModule
  ],
  controllers: [CentralBloodStorageController],
  providers: [CentralBloodStorageService],
  exports: [CentralBloodStorageService]
})
export class CentralBloodStorageModule {}