import { ApiProperty } from "@nestjs/swagger";
import { ResponseData } from "src/shared/dtos/responses/data.response";

export class DeleteByIdWorkingHoursDTOPartial {
  @ApiProperty({ example: 1, description: 'Number of deleted records (0 or 1)' })
  deleted: number;
}

export class DeleteByIdWorkingHoursDTO extends ResponseData {
  @ApiProperty({ type: DeleteByIdWorkingHoursDTOPartial })
  data: DeleteByIdWorkingHoursDTOPartial;
}
