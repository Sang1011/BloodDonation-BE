import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Status } from 'src/shared/enums/status.enum';

export class CreateDonateBloodDto {
  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // blood_id: string;


  @ApiProperty()
  @IsDateString()
  date_donate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  centralBlood_id?: number;
}