import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CentralBlood, CentralBloodSchema } from "./schemas/central_blood.schema";
import { CentralBloodController } from "./central_blood.controller";
import { CentralBloodService } from "./central_blood.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CentralBlood.name, schema: CentralBloodSchema }, 
    ])
  ],
  controllers: [CentralBloodController],
  providers: [CentralBloodService],
  exports: [CentralBloodService]
})
export class CentralBloodModule {}