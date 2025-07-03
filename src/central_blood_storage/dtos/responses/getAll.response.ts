import { ApiProperty } from '@nestjs/swagger';
import { GetCentralBloodStorageResponse } from './get.response';

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

export class GetAllCentralStorageResponseDto {
  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;

  @ApiProperty({ type: [GetCentralBloodStorageResponse] })
  result: GetCentralBloodStorageResponse[];
}