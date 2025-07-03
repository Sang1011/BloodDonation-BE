import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Storage, StorageSchema } from "./schemas/storage.schema";
import { StorageController } from "./storage.controller";
import { StorageService } from "./storage.service";
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Storage.name, schema: StorageSchema }, 
    ])
  ],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService]
})
export class StorageModule {}