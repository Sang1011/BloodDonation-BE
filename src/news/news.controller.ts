import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { ResponseMessage } from "src/shared/decorators/message.decorator";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { FindAllQueryDTO } from "src/shared/dtos/requests/find-all-query.request";
import { Public } from "src/shared/decorators/public.decorator";
import { DeleteNewsResponse } from "./dtos/responses/delete.response";
import { UpdateNewsDto } from "./dtos/requests/update.request";
import { UpdateNewsDTO } from "./dtos/responses/update.response";
import { GetNewsResponse } from "./dtos/responses/get.response";
import { GetAllNewsResponse } from "./dtos/responses/getAll.response";
import { CreateNewsDto } from "./dtos/requests/create.request";
import { CreateNewsResponse } from "./dtos/responses/create.response";
import { NewsService } from "./news.services";
import { Roles } from "src/shared/decorators/role.decorator";


@ApiTags('News')
@Controller("news")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Roles('ADMIN', 'STAFF')
  @ApiCreatedResponse({
    description: 'News created successfully',
    type: CreateNewsResponse,
  })
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @Post()
  @ResponseMessage("Create a new news")
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  @Public()
  @ApiOkResponse({ type: GetAllNewsResponse })
  @ResponseMessage("Fetch news by filter")
  findAll(@Query() query: FindAllQueryDTO) {
    return this.newsService.findAll(+query.current, +query.pageSize, query.qs);
  }

  @Get(":id")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOkResponse({ type: GetNewsResponse })
  @ResponseMessage("Fetch news by id")
  findOne(@Param("id") id: string) {
    return this.newsService.findOne(id);
  }

  @Roles('ADMIN', 'STAFF')
  @Patch(":id")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOkResponse({
    description: 'Update news successfully',
    type: UpdateNewsDTO,
  })
  @ResponseMessage("Update a news")
  update(@Param("id") id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Roles('ADMIN', 'STAFF')
  @Delete(":id")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOkResponse({
    description: 'News deleted successfully',
    type: DeleteNewsResponse,
  })
  @ResponseMessage("Delete a news")
  remove(@Param("id") id: string) {
    return this.newsService.remove(id);
  }
}
