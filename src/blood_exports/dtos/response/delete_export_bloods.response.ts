import { ApiProperty } from "@nestjs/swagger";
import { ResponseData } from "src/shared/dtos/responses/data.response";

export class DeleteByIdExportBloodDTOPartial {
  @ApiProperty({ example: true })
  acknowledged: boolean;

  @ApiProperty({ example: 1 })
  deletedCount: number;
}

export class DeleteByIdExportBloodDTO extends ResponseData {
  @ApiProperty({ type: DeleteByIdExportBloodDTOPartial })
  data: DeleteByIdExportBloodDTOPartial;
}
