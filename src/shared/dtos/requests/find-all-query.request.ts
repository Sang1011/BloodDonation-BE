import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAllQueryDTO {
  @ApiPropertyOptional({ example: '1', description: 'Current page number' })
  current?: string;

  @ApiPropertyOptional({ example: '10', description: 'Items per page' })
  pageSize?: string;

  @ApiPropertyOptional({ description: 'Any other query string filter' })
  qs?: string;
}
