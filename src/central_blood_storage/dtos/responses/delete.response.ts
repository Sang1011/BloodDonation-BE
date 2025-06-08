import { ApiProperty } from "@nestjs/swagger";
import { ResponseData } from "src/shared/dtos/responses/data.response";

export class DeleteByIdCentralBloodStorageDTOPartial {
  @ApiProperty({ example: 1, description: 'Number of deleted records (0 or 1)' })
  deleted: number;
}

export class DeleteByIdCentralBloodStorageDTO extends ResponseData {
  @ApiProperty({ type: DeleteByIdCentralBloodStorageDTOPartial })
  data: DeleteByIdCentralBloodStorageDTOPartial;
}
