import { ApiProperty } from "@nestjs/swagger";
import { ResponseData } from "src/shared/dtos/responses/data.response";

export class DeleteByIdCentralBloodStorageDTOPartial {
  @ApiProperty({ example: true })
  acknowledged: boolean;

  @ApiProperty({ example: 1 })
  deletedCount: number;
}

export class DeleteByIdCentralBloodStorageDTO extends ResponseData {
  @ApiProperty({ type: DeleteByIdCentralBloodStorageDTOPartial })
  data: DeleteByIdCentralBloodStorageDTOPartial;
}
