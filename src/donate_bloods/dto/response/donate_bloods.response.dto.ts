import { ApiProperty } from '@nestjs/swagger';

export class DonateBloodResponseDto {
  @ApiProperty()
  donate_id: string;

  @ApiProperty()
  blood_id: string;

  @ApiProperty()
  date_register: Date;

  @ApiProperty()
  date_donate: Date;

  @ApiProperty()
  ml: number;

  @ApiProperty()
  unit: number;

  @ApiProperty({ required: false })
  status_regist?: string;

  @ApiProperty({ required: false })
  status_donate?: string;

  @ApiProperty()
  infor_health: string;

  @ApiProperty({ required: false })
  centralBlood_id?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}