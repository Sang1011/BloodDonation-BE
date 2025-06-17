import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Location, LocationSchema } from "./schemas/location.schema";
import { LocationService } from "./location.service";
import { LocationController } from "./location.controller";
import { SharedModule } from "src/shared/modules/sharedModule.module";

@Module({
  imports: [MongooseModule.forFeature([{ name: Location.name, schema: LocationSchema }]), SharedModule],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService]
})
export class LocationsModule {}
