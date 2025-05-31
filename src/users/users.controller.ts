import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/requests/create-user.dto";
import { UpdateUserDto } from "./dto/requests/update-user.dto";
import { ResponseMessage } from "src/shared/decorators/message.decorator";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserResponseDTO } from "./dto/responses/create-user.response";
import { UpdateUserResponse } from "./dto/responses/update-user.response";
import { DeleteUserResponse } from "./dto/responses/delete-user.response";
import { GetUserByIdSwaggerResponse } from "./dto/responses/get-user.response";
import { GetAllUserResponseDto } from "./dto/responses/find-all.response";
import { FindAllQueryDTO } from "src/shared/dtos/requests/find-all-query.request";
import { Public } from "src/shared/decorators/public.decorator";


@ApiTags('Users')
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @ApiCreatedResponse({
  description: 'User created successfully',
  type: CreateUserResponseDTO,
  })
  @Post()
  @ResponseMessage("Create a new user")
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Public()
  @ApiOkResponse({ type: GetAllUserResponseDto })
  @ResponseMessage("Fetch user by filter")
  findAll(@Query() query: FindAllQueryDTO) {
  return this.usersService.findAll(+query.current, +query.pageSize, query.qs);
}

  @ApiOkResponse({ type: GetUserByIdSwaggerResponse })
  @Get(":id")
  @ResponseMessage("Fetch user by id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @ApiOkResponse({
    description: 'Update user successfully',
    type: UpdateUserResponse,
  })
  @ResponseMessage("Update a user")
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(":id")
  @ApiOkResponse({
    description: 'User deleted successfully',
    type: DeleteUserResponse,
  })
  @ResponseMessage("Delete a user")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
