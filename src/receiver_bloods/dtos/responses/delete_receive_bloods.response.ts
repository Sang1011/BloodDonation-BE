import { ApiProperty } from "@nestjs/swagger";
import { ResponseData } from "src/shared/dtos/responses/data.response";

export class DeleteByIdReceiveBloodDTOPartial {
  @ApiProperty({ example: true })
  acknowledged: boolean;

  @ApiProperty({ example: 1 })
  deletedCount: number;
}

export class DeleteByIdReceiveBloodDTO extends ResponseData {
  @ApiProperty({ type: DeleteByIdReceiveBloodDTOPartial })
  data: DeleteByIdReceiveBloodDTOPartial;
}
