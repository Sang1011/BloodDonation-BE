import { PartialType } from '@nestjs/swagger';
import { CreateReceiveBloodDto } from './create_receive_bloods.dto';

export class UpdateReceiveBloodDto extends PartialType(CreateReceiveBloodDto) {}