import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiBearerAuth, ApiSecurity } from "@nestjs/swagger";
import { ResponseMessage } from "src/shared/decorators/message.decorator";
import { Public } from "src/shared/decorators/public.decorator";
import { FindAllQueryDTO } from "src/shared/dtos/requests/find-all-query.request";
import { CreateWorkingHoursDto } from "./dto/request/create_working_hours.dto";
import { GetAllWorkingHoursResponseDto } from "./dto/response/getAll_working_hours.response";
import { GetWorkingHoursResponseDto } from "./dto/response/get_working_hours.response";
import { UpdateWorkingHoursDto } from "./dto/request/update_working_hours.dto";
import { DeleteByIdWorkingHoursDTO } from "./dto/response/delete_working_hours.response";
import { WorkingHoursService } from "./working_hours.service";
import { Roles } from "src/shared/decorators/role.decorator";

@ApiTags('Working Hours')
@Controller('working-hours')
export class WorkingHoursController {
  constructor(private readonly service: WorkingHoursService) { }

  @Roles('ADMIN','STAFF')
  @Post()
  @ApiCreatedResponse({ type: CreateWorkingHoursDto })
  @ResponseMessage("Created working hours")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  create(@Body() dto: CreateWorkingHoursDto) {
    return this.service.create(dto);
  }

  @Get()
  @Public()
  @ApiOkResponse({ type: GetAllWorkingHoursResponseDto })
  @ResponseMessage("List all working hours")
  findAll(@Query() query: FindAllQueryDTO) {
    return this.service.findAll(+query.current, +query.pageSize, query.qs);
  }

  @Get("schedule")
  @Public()
  @ApiOkResponse({ type: GetAllWorkingHoursResponseDto })
  @ResponseMessage("List all working hours")
  findSchedule(@Query("date") date: string) {
    return this.service.findCentralByWorkingDay(new Date(date));
  }

  
  @Roles('ADMIN','STAFF')
  @Patch(":id")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOkResponse({ type: GetWorkingHoursResponseDto })
  @ResponseMessage("Update working hours")
  update(@Param("id") id: string, @Body() dto: UpdateWorkingHoursDto) {
    return this.service.update(id, dto);
  }

  // @Delete(":id")
  // @ApiBearerAuth('access-token')
  // @ApiSecurity('access-token')
  // @ApiOkResponse({ type: DeleteByIdWorkingHoursDTO })
  // @ResponseMessage("Delete working hours")
  // remove(@Param("id") id: string) {
  //   return this.service.remove(id);
  // }

  @Roles('ADMIN','STAFF')
  @Delete(":id")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOkResponse({ type: DeleteByIdWorkingHoursDTO })
  @ResponseMessage("Delete working hours")
  softRemove(@Param("id") id: string) {
    return this.service.softRemove(id);
  }

  @Roles('ADMIN','STAFF')
  @Patch(":id/restore")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOkResponse({ type: DeleteByIdWorkingHoursDTO })
  @ResponseMessage("Restore working hours")
  restore(@Param("id") id: string) {
    return this.service.restore(id);
  }

  @Get(":id")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOkResponse({ type: GetWorkingHoursResponseDto })
  @ResponseMessage("Get working hours by id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

}