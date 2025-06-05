import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiBearerAuth, ApiSecurity } from "@nestjs/swagger";
import { ResponseMessage } from "src/shared/decorators/message.decorator";
import { Public } from "src/shared/decorators/public.decorator";
import { FindAllQueryDTO } from "src/shared/dtos/requests/find-all-query.request";
import { CreateCentralBloodStorageResponseDto } from "./dtos/responses/create.response";
import { CreateCentralBloodStorageDto } from "./dtos/requests/create.dto";
import { GetAllCentralStorageResponseDto } from "./dtos/responses/getAll.response";
import { GetByIdCentralBloodStorageResponseDto } from "./dtos/responses/get.response";
import { UpdateCentralBloodStorageDto } from "./dtos/requests/update.dto";
import { DeleteByIdCentralBloodStorageDTO } from "./dtos/responses/delete.response";
import { CentralStorageService } from "./central_blood_storage.service";

@ApiTags('Central Storages')
@ApiBearerAuth('access-token')
@ApiSecurity('access-token')
@Controller('central-storages')
export class CentralStorageController {
  constructor(private readonly service: CentralStorageService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateCentralBloodStorageResponseDto })
  @ResponseMessage("Created a storage")
  create(@Body() dto: CreateCentralBloodStorageDto) {
    return this.service.create(dto);
  }

  @Get()
  @Public()
  @ApiOkResponse({ type: GetAllCentralStorageResponseDto })
  @ResponseMessage("List all storages")
  findAll(@Query() query: FindAllQueryDTO) {
    return this.service.findAll(+query.current, +query.pageSize, query.qs);
  }

  @Get(":id")
  @ApiOkResponse({ type: GetByIdCentralBloodStorageResponseDto })
  @ResponseMessage("Get a storage by id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Patch(":id")
  @ApiOkResponse({ type: GetByIdCentralBloodStorageResponseDto })
  @ResponseMessage("Update a storage")
  update(@Param("id") id: string, @Body() dto: UpdateCentralBloodStorageDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @ApiOkResponse({ type: DeleteByIdCentralBloodStorageDTO })
  @ResponseMessage("Delete a storage")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
