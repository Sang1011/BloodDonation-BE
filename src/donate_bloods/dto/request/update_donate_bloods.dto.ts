import { PartialType } from '@nestjs/swagger';
import { CreateDonateBloodDto } from './create_donate_bloods.dto';

export class UpdateDonateBloodDto extends PartialType(CreateDonateBloodDto) {}