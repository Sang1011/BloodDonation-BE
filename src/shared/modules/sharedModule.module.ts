import { Module } from "@nestjs/common";
import { GeocodingService } from "../services/geoLocation.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  providers: [GeocodingService],
  exports: [GeocodingService],
})
export class SharedModule {}