import { ApiProperty } from "@nestjs/swagger";
import { ResponseData } from "src/shared/dtos/responses/data.response";
import { WorkingHoursResponseDto } from "src/working_hours/dto/response/working_hours.response.dto";

export class GetCentralResponse {
  @ApiProperty({ example: 1 })
  centralBlood_id: number;

  @ApiProperty({ example: 'Trung tâm truyền máu trung ương' })
  centralBlood_name: string;

  @ApiProperty({ example: '123 Lê Lợi, Quận 1, TP.HCM' })
  centralBlood_address: string;

  @ApiProperty({ type: WorkingHoursResponseDto })
  working_id: WorkingHoursResponseDto;
}

export class GetByIdCentralDTO extends ResponseData {
    @ApiProperty({ type: GetCentralResponse })
    data: GetCentralResponse;
}