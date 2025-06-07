import { ApiProperty } from "@nestjs/swagger";
import { ResponseData } from "src/shared/dtos/responses/data.response";

export class DeleteByIdDonateBloodDTOPartial {
  @ApiProperty({ example: true })
  acknowledged: boolean;

  @ApiProperty({ example: 1 })
  deletedCount: number;
}

export class DeleteByIdDonateBloodDTO extends ResponseData {
  @ApiProperty({ type: DeleteByIdDonateBloodDTOPartial })
  data: DeleteByIdDonateBloodDTOPartial;
}
