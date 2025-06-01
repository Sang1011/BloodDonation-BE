import { PartialType } from '@nestjs/swagger';
import { CreateExportBloodDto } from './create_export.request';

export class UpdateExportBloodDto extends PartialType(CreateExportBloodDto) {}