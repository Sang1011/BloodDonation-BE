import { ApiProperty } from '@nestjs/swagger';
import { ExportBloodResponseDto } from './export_bloods.response.dto';

export class CreateExportBloodResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Export blood record created successfully.' })
  message: string;

  @ApiProperty({ type:() => ExportBloodResponseDto })
  data: ExportBloodResponseDto;
}