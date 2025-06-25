import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateReceiveBloodDto } from './create_receive_bloods.dto';
import { Status } from 'src/shared/enums/status.enum';
import { IsOptional } from 'class-validator';
import { IsString } from 'class-validator';

export class UpdateReceiveBloodDto extends PartialType(CreateReceiveBloodDto) {
   @ApiProperty({required: false, example: Status.APPROVED})
   @IsOptional()
   @IsString()
   status_regist?: Status;
 
   @ApiProperty({ required: false, example: Status.COMPLETED })
   @IsOptional()
   @IsString()
   status_receive?: Status;   
}