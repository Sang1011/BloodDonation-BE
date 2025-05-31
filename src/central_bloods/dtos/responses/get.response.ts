import { ApiProperty } from "@nestjs/swagger";
import { ResponseData } from "src/shared/dtos/responses/data.response";

export class GetCentralResponse {
  @ApiProperty({ example: 1 })
  centralBlood_id: number;

  @ApiProperty({ example: 'Trung tâm truyền máu trung ương' })
  centralBlood_name: string;

  @ApiProperty({ example: '123 Lê Lợi, Quận 1, TP.HCM' })
  centralBlood_address: string;
}

export class GetByIdCentralDTO extends ResponseData {
    @ApiProperty({ type: GetCentralResponse })
    data: GetCentralResponse;
}