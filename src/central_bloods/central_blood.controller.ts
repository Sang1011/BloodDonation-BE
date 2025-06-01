import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { ResponseMessage } from "src/shared/decorators/message.decorator";
import { Public } from "src/shared/decorators/public.decorator";
import { CentralBloodService } from "./central_blood.service";
import { CreateCentralBloodDto } from "./dtos/requests/create.dto";
import { UpdateCentralBloodDto } from "./dtos/requests/update.dto";
import { CreateCentralDTO } from "./dtos/responses/create.response";
import { GetAllCentralResponseDto } from "./dtos/responses/getAll.response";
import { GetByIdCentralDTO, GetCentralResponse } from "./dtos/responses/get.response";
import { FindAllQueryDTO } from "src/shared/dtos/requests/find-all-query.request";
import { DeleteByIdCentralDTO } from "./dtos/responses/delete.response";

@ApiTags('Central Blood')
@Controller('central-blood')
export class CentralBloodController {
  constructor(private readonly service: CentralBloodService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateCentralDTO })
  @ResponseMessage("Created central blood")
  create(@Body() dto: CreateCentralBloodDto) {
    return this.service.create(dto);
  }

  @Get()
  @Public()
  @ApiOkResponse({ type: GetAllCentralResponseDto })
  @ResponseMessage("List all central blood centers")
  findAll(@Query() query: FindAllQueryDTO) {
    return this.service.findAll(+query.current, +query.pageSize, query.qs);
  }

  @Get(":id")
  @ApiOkResponse({ type: GetByIdCentralDTO })
  @ResponseMessage("Get central blood center by id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Patch(":id")
  @ApiOkResponse({ type: GetByIdCentralDTO })
  @ResponseMessage("Update central blood center")
  update(@Param("id") id: string, @Body() dto: UpdateCentralBloodDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @ApiOkResponse({ type: DeleteByIdCentralDTO })
  @ResponseMessage("Delete central blood center")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
