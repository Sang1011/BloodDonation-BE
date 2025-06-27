import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { Status } from 'src/shared/enums/status.enum';

export class CreateStorageDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  donate_id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  blood_id: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  date: Date;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  ml: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  unit: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  expired_date: Date;

  @ApiProperty()
  @IsOptional()
  
  current_status: Status;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  centralBlood_id: number;
}
