import { ApiProperty } from '@nestjs/swagger';

export class ReceiveBloodResponseDto {
  @ApiProperty()
  donate_id: string;

  @ApiProperty()
  blood_id: string;

  @ApiProperty()
  date_register: Date;

  @ApiProperty()
  date_receiver: Date;

  @ApiProperty()
  ml: number;

  @ApiProperty()
  unit: number;

  @ApiProperty({ required: false })
  status_regist?: string;

  @ApiProperty({ required: false })
  status_receiver?: string;

    @ApiProperty()
    infor_health: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}