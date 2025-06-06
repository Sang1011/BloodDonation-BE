import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { CreateInforHealthDto } from "./dtos/requests/create.request";
import { UpdateInforHealthDto } from "./dtos/requests/update.request";
import { FindAllQueryDTO } from "src/shared/dtos/requests/find-all-query.request";
import { ResponseMessage } from "src/shared/decorators/message.decorator";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { Public } from "src/shared/decorators/public.decorator";
import { InforHealthService } from "./infor-healths.service";

@ApiTags("Infor Health")
@Controller("infor-health")
export class InforHealthController {
  constructor(private readonly inforHealthService: InforHealthService) { }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiCreatedResponse({
    description: "Health information created successfully",
  })
  @ResponseMessage("Create a new health info record")
  create(@Body() createDto: CreateInforHealthDto) {
    return this.inforHealthService.create(createDto);
  }

  @Get()
  @Public()
  @ApiOkResponse({
    description: "Get list of health information"
  })
  @ResponseMessage("Fetch health info list")
  findAll(@Query() query: FindAllQueryDTO) {
    return this.inforHealthService.findAll(+query.current, +query.pageSize, query.qs);
  }

  @Get(":id")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOkResponse({
    description: "Get health info by ID"
  })
  @ResponseMessage("Fetch health info by id")
  findOne(@Param("id") id: string) {
    return this.inforHealthService.findOne(id);
  }

  @Patch(":id")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOkResponse({
    description: "Health info updated successfully"
  })
  @ResponseMessage("Update a health info record")
  update(@Param("id") id: string, @Body() updateDto: UpdateInforHealthDto) {
    return this.inforHealthService.update(id, updateDto);
  }

  @Delete(":id")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOkResponse({
    description: "Health info deleted successfully"
  })
  @ResponseMessage("Delete a health info record")
  remove(@Param("id") id: string) {
    return this.inforHealthService.remove(id);
  }
}
