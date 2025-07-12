import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiBearerAuth, ApiSecurity } from "@nestjs/swagger";
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
import { Roles } from "src/shared/decorators/role.decorator";

@ApiTags('Central Blood')
@Controller('central-blood')
export class CentralBloodController {
  constructor(private readonly service: CentralBloodService) { }

  @Roles('ADMIN', 'STAFF')
  @Post()
  @ApiCreatedResponse({ type: CreateCentralDTO })
  @ResponseMessage("Created central blood")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
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
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOkResponse({ type: GetByIdCentralDTO })
  @ResponseMessage("Get central blood center by id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Roles('ADMIN', 'STAFF')
  @Patch(":id")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOkResponse({ type: GetByIdCentralDTO })
  @ResponseMessage("Update central blood center")
  update(@Param("id") id: string, @Body() dto: UpdateCentralBloodDto) {
    return this.service.update(id, dto);
  }

  @Roles('ADMIN', 'STAFF')
  @Delete(":id")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOkResponse({ type: DeleteByIdCentralDTO })
  @ResponseMessage("Delete central blood center")
  remove(@Param("id") id: string) {
    return this.service.softRemove(id);
  }
}
