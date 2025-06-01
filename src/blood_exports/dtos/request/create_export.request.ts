import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExportBloodDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  storage_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  receiver_id: string

  @ApiProperty()
  @IsDateString()
  export_date: Date;

  @ApiProperty()
  @IsString()
  status: string;
}