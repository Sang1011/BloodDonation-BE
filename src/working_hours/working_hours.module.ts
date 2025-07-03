import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WorkingHours, WorkingHoursSchema } from "./schemas/working_hours.schema";
import { WorkingHoursController } from "./working_hours.controller";
import { WorkingHoursService } from "./working_hours.service";
import { CentralBloodModule } from "src/central_bloods/central_blood.module";


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkingHours.name, schema: WorkingHoursSchema },
    ]), forwardRef(() => CentralBloodModule)
  ],
  controllers: [WorkingHoursController],
  providers: [WorkingHoursService],
  exports: [WorkingHoursService]
})
export class WorkingHoursModule {}