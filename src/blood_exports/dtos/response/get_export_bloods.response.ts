import { ApiProperty } from '@nestjs/swagger';
import { ExportBloodResponseDto } from './export_bloods.response.dto';

export class GetExportBloodResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;
  
  @ApiProperty({ example: 'Export blood record retrieved successfully' })
  message: string;

  @ApiProperty({ type: () => ExportBloodResponseDto })
  data: ExportBloodResponseDto;
}