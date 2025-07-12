import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiSecurity, ApiBearerAuth } from "@nestjs/swagger";
import { ResponseMessage } from "src/shared/decorators/message.decorator";
import { Public } from "src/shared/decorators/public.decorator";
import { CreateStorageDTO } from "./dtos/responses/create.response";
import { CreateStorageDto } from "./dtos/requests/create.dto";
import { GetAllStorageResponseDto } from "./dtos/responses/getAll.response";
import { FindAllQueryDTO } from "src/shared/dtos/requests/find-all-query.request";
import { GetByIdStorageDTO } from "./dtos/responses/get.response";
import { UpdateStorageDto } from "./dtos/requests/update.dto";
import { DeleteByIdStorageDTO } from "./dtos/responses/delete.response";
import { StorageService } from "./storage.service";
import { Roles } from "src/shared/decorators/role.decorator";

@ApiTags('Storages')
@Controller('storages')
export class StorageController {
  constructor(private readonly service: StorageService) { }

  @Roles('ADMIN','STAFF')
  @Post()
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiCreatedResponse({ type: CreateStorageDTO })
  @ResponseMessage("Created a storage")
  create(@Body() dto: CreateStorageDto) {
    return this.service.create(dto);
  }

  @Get()
  @Public()
  @ApiOkResponse({ type: GetAllStorageResponseDto })
  @ResponseMessage("List all storages")
  findAll(@Query() query: FindAllQueryDTO) {
    return this.service.findAll(+query.current, +query.pageSize, query.qs);
  }

  @Get(":id")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOkResponse({ type: GetByIdStorageDTO })
  @ResponseMessage("Get a storage by id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Roles('ADMIN','STAFF')
  @Patch(":id")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOkResponse({ type: GetByIdStorageDTO })
  @ResponseMessage("Update a storage")
  update(@Param("id") id: string, @Body() dto: UpdateStorageDto) {
    return this.service.update(id, dto);
  }

  @Roles('ADMIN','STAFF')
  @Delete(":id")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOkResponse({ type: DeleteByIdStorageDTO })
  @ResponseMessage("Delete a storage")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
