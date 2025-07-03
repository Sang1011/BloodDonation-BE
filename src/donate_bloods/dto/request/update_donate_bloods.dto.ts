import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDonateBloodDto } from './create_donate_bloods.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Status } from 'src/shared/enums/status.enum';

export class UpdateDonateBloodDto extends PartialType(CreateDonateBloodDto) {
    @ApiProperty()
   @IsNumber()
  @IsOptional()
  ml?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  unit?: number;    

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  status_regist?: Status;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status_donate?: Status;   
}