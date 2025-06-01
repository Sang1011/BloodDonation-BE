import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateStorageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  donate_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  blood_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  ml: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  unit: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  expired_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  current_status: string;
}
