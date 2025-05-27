import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BloodGroup, BloodGroupSchema } from "./schemas/blood-group.schema";
import { BloodGroupsService } from "./blood-groups.service";
import { BloodGroupsController } from "./blood-groups.controller";

@Module({
  imports: [MongooseModule.forFeature([{ name: BloodGroup.name, schema: BloodGroupSchema }])],
  controllers: [BloodGroupsController],
  providers: [BloodGroupsService],
  exports: [BloodGroupsService, MongooseModule]
})
export class BloodGroupsModule {}
