import { ApiProperty } from "@nestjs/swagger";
import { ResponseData } from "src/shared/dtos/responses/data.response";
import { GetCentralBloodStorageResponse } from "./get.response";
export class CreateCentralBloodStorageResponseDto extends ResponseData {
  @ApiProperty({ type: GetCentralBloodStorageResponse })
  data: GetCentralBloodStorageResponse;
}
