import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GetCentralResponse } from './get.response';

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  current: number;

  @ApiProperty({ example: 10 })
  pageSize: number;

  @ApiProperty({ example: 1 })
  pages: number;

  @ApiProperty({ example: 2 })
  total: number;
}

export class GetAllCentralResponseDto {
  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;

  @ApiProperty({ type: [GetCentralResponse] })
  result: GetCentralResponse[];
}

