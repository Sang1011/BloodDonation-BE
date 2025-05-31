import { PartialType } from '@nestjs/swagger';
import { CreateStorageDto } from './create.dto';

export class UpdateStorageDto extends PartialType(CreateStorageDto) {}
