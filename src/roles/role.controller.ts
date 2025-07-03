import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus, Query, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { ResponseMessage } from 'src/shared/decorators/message.decorator';
import { CreateRoleDto } from './dtos/requests/create.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { FindAllQueryDTO } from 'src/shared/dtos/requests/find-all-query.request';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully.' })
  @ResponseMessage('Role created successfully')
  @Public()
  async create(@Body() body: CreateRoleDto) {
    return this.roleService.create(body);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'List of roles' })
  @ResponseMessage('Roles retrieved successfully')
  async findAll(@Query() query: FindAllQueryDTO) {
    return this.roleService.findAll(+query.current, +query.pageSize, query.qs);
  }

  @Get(':role_id')
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiParam({ name: 'role_id', required: true, description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role found' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ResponseMessage('Role retrieved successfully')
  async findOne(@Param('role_id') role_id: string) {
    return this.roleService.findById(role_id);
  }

  @Delete(":id")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ResponseMessage("Delete role by id")
  @ApiOperation({ summary: 'Delete role by id' })
  deketeOne(@Param("id") id: string) {
    return this.roleService.softRemove(id);
  }
}
