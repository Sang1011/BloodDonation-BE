import { ApiProperty } from '@nestjs/swagger';
import { NewsResponseDto } from './get.response';

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

export class GetAllNewsResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Retrieved all news records successfully' })
  message: string;
  
  @ApiProperty({ type: MetaDto })
  meta: MetaDto;

 @ApiProperty({ isArray: true, type: () => NewsResponseDto })
  data: NewsResponseDto[];
}