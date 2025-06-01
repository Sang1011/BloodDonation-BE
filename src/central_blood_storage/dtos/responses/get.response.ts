import { ApiProperty } from "@nestjs/swagger";
import { ResponseData } from "src/shared/dtos/responses/data.response";

export class GetCentralBloodStorageResponse {
  @ApiProperty({ example: 1 })
  centralStorage_id: number;

  @ApiProperty({ example: 1 })
  centralBlood_id: number;

  @ApiProperty({ example: "STO123456" })
  storage_id: string;
}

export class GetByIdCentralBloodStorageResponseDto extends ResponseData {
  @ApiProperty({ type: GetCentralBloodStorageResponse })
  data: GetCentralBloodStorageResponse;
}
