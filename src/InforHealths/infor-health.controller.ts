import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from "@nestjs/common";
import { CreateInforHealthDto } from "./dtos/requests/create.request";
import { UpdateInforHealthDto } from "./dtos/requests/update.request";
import { FindAllQueryDTO } from "src/shared/dtos/requests/find-all-query.request";
import { ResponseMessage } from "src/shared/decorators/message.decorator";
import { ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { Public } from "src/shared/decorators/public.decorator";
import { InforHealthService } from "./infor-healths.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { IUser } from "src/shared/interfaces/user.interface";
import { User } from "src/shared/decorators/users.decorator";


@ApiTags("Infor Health")  
@Controller("infor-health")
export class InforHealthController {
  constructor(private readonly inforHealthService: InforHealthService) { }

  @Post("/admin")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiCreatedResponse({
    description: "Health information created successfully",
  })
  @UseInterceptors(FileInterceptor('img_health'))
  @ApiConsumes('multipart/form-data')
  @ResponseMessage("Create a new health info record")
  create(@Body() createDto: CreateInforHealthDto, @UploadedFile() file?: Express.Multer.File) {
    return this.inforHealthService.create(createDto, file);
  }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiCreatedResponse({
    description: "Health information created successfully",
  })
  @UseInterceptors(FileInterceptor('img_health'))
  @ApiConsumes('multipart/form-data')
  @ResponseMessage("Create a new health info record")
  createByUser(@User() user: IUser, @Body() createDto: CreateInforHealthDto, @UploadedFile() file?: Express.Multer.File) {
    return this.inforHealthService.createByUser(user, createDto, file);
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
  

  @Patch(":id/admin")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @UseInterceptors(FileInterceptor('img_health'))
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: "Health info updated successfully"
  })
  @ResponseMessage("Update a health info record")
  updateAdmin(
    @Param("id") id: string,
    @Body() updateDto: UpdateInforHealthDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.inforHealthService.update(id, updateDto, file);
  }

  @Patch()
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @UseInterceptors(FileInterceptor('img_health'))
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: "Health info updated successfully"
  })
  @ResponseMessage("Update a health info record")
  update(
    @User() user: IUser,
    @Body() updateDto: UpdateInforHealthDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.inforHealthService.updateByUser(user, updateDto, file);
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
