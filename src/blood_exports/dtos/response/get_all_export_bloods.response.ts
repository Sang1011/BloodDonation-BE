import { ApiProperty } from '@nestjs/swagger';
import { ExportBloodResponseDto } from './export_bloods.response.dto';

class MetaDto {
  @ApiProperty({ example: 1 })
  current: number;

  @ApiProperty({ example: 10 })
  pageSize: number;

  @ApiProperty({ example: 5 })
  pages: number;

  @ApiProperty({ example: 50 })
  total: number;
}

export class GetAllExportBloodResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Retrieved all export blood records successfully' })
  message: string;
  
  @ApiProperty({ type: MetaDto })
  meta: MetaDto;

 @ApiProperty({ isArray: true, type: () => ExportBloodResponseDto })
  data: ExportBloodResponseDto[];
}