import { Controller, Post, Get, Body, Param, Patch, Query, UseGuards, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiOkResponse, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dtos/requests/create.dto';
import { ResponseMessage } from 'src/shared/decorators/message.decorator';
import { UpdateLocationDto } from './dtos/requests/update.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { FindAllQueryDTO } from 'src/shared/dtos/requests/find-all-query.request';
import { UserRole } from 'src/shared/enums/user.enum';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/shared/decorators/role.decorator';

@ApiTags('Locations')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) { }

  @Roles('ADMIN')
  @Post()
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOperation({ summary: 'Create new location' })
  @ApiResponse({ status: 201, description: 'Location created successfully' })
  @ResponseMessage('Location created successfully')
  async create(@Body() body: CreateLocationDto) {
    return this.locationService.create(body);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all locations' })
  @ApiOkResponse({ status: 200, description: 'List of locations' })
  @ResponseMessage('Locations retrieved successfully')
  async findAll(@Query() query: FindAllQueryDTO) {
    return this.locationService.findAll(+query.current, +query.pageSize, query.qs);
  }

  @Get(':location_id')
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOperation({ summary: 'Get location by ID' })
  @ApiParam({ name: 'location_id', description: 'Location ID' })
  @ApiResponse({ status: 200, description: 'Location found' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  @ResponseMessage('Location retrieved successfully')
  async findOne(@Param('location_id') id: string) {
    return this.locationService.findById(id);
  }

  @Patch(':location_id')
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOperation({ summary: 'Patch a location by ID' })
  @ApiParam({ name: 'location_id', description: 'Location ID' })
  @ApiResponse({ status: 200, description: 'Location updated successfully' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  @ResponseMessage('Location patched successfully')
  async update(@Param('location_id') id: string, @Body() body: UpdateLocationDto) {
    return this.locationService.update(id, body);
  }

  @Roles('ADMIN')
  @Delete(":id")
    @ApiBearerAuth('access-token')
    @ApiSecurity('access-token')
    @ResponseMessage("Delete location")
    softRemove(@Param("id") id: string) {
      return this.locationService.softRemove(id);
    }
}
