import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CentralBlood, CentralBloodSchema } from "./schemas/central_blood.schema";
import { CentralBloodController } from "./central_blood.controller";
import { CentralBloodService } from "./central_blood.service";
import { WorkingHoursModule } from "src/working_hours/working_hours.module";
import { SharedModule } from "src/shared/modules/sharedModule.module";
import { WorkingHours } from "src/working_hours/schemas/working_hours.schema";
import { WorkingHoursSchema } from "src/working_hours/schemas/working_hours.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CentralBlood.name, schema: CentralBloodSchema },
      { name: WorkingHours.name, schema: WorkingHoursSchema }
    ]), forwardRef(() => WorkingHoursModule)
  ,SharedModule],
  controllers: [CentralBloodController],
  providers: [CentralBloodService],
  exports: [
    CentralBloodService,
    MongooseModule
  ]
})
export class CentralBloodModule {}