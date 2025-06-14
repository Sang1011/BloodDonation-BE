import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { Public } from 'src/shared/decorators/public.decorator';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @Get('distance')
  @ApiOperation({ summary: 'Find nearby blood donors/recipients' })
  @ApiQuery({ name: 'user_id', required: true, description: 'ID của người dùng hiện tại' })
  @ApiQuery({ name: 'radiusInKm', required: true, description: 'Bán kính cần tìm (tính theo km)' })
  @ApiQuery({
    name: 'typeToSearch',
    required: false,
    enum: ['DONATE', 'RECEIVE', 'HISTORY'],
    description: 'Loại người cần tìm: ALL (mặc định), DONATE, RECEIVE, HISTORY',
  })
  @ApiResponse({ status: 200, description: 'Danh sách người dùng gần nhất' })
  async searchByDistance(
    @Query('user_id') user_id: string,
    @Query('radiusInKm') radiusInKm: number,
    @Query('typeToSearch') typeToSearch?: string,
  ) {
    return this.searchService.searchByDistance(user_id, radiusInKm, typeToSearch);
  }
}
