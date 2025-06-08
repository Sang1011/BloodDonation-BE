import { PartialType } from '@nestjs/swagger';
import { CreateNewsDto } from './create.request';

export class UpdateNewsDto extends PartialType(CreateNewsDto) {}
