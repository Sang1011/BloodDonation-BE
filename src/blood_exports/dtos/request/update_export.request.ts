import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateExportBloodDto } from './create_export.request';
import { IsOptional } from 'class-validator';

export class UpdateExportBloodDto extends PartialType(CreateExportBloodDto) {
    @ApiProperty()
    @IsOptional()
    status: string;
}