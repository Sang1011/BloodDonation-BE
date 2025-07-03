import { ApiProperty } from '@nestjs/swagger';
import { ExportBloodResponseDto } from './export_bloods.response.dto';

export class UpdateExportBloodResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Export blood record updated successfully.' })
  message: string;

  @ApiProperty({ type: () => ExportBloodResponseDto })
  data: ExportBloodResponseDto;
}