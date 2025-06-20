import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { Status } from 'src/shared/enums/status.enum';

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
  @IsEnum(Status)
  current_status: Status;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  centralBlood_id: number;
}
