import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReceiveBloodDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  blood_id: string;

  
  @ApiProperty()
  @IsDateString()
  date_receiver: Date;

  @ApiProperty()
  @IsNumber()
  ml: number;

  @ApiProperty()
  @IsNumber()
  unit: number;

  @ApiProperty({example: 'DEFAULT'})
  @IsString()
  @IsNotEmpty()
  type: 'EMERGENCY' | 'DEFAULT';

  // @ApiProperty({ required: false })
  // @IsOptional()
  // @IsString()
  // status_regist?: string;

  // @ApiProperty({ required: false })
  // @IsOptional()
  // @IsString()
  // status_receiver?: string;

  // @ApiProperty()
  // @IsString()
  // infor_health: string;

  // @ApiProperty()
  // @IsString()
  // @IsOptional()
  // user_id?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  centralBlood_id?: string;
}