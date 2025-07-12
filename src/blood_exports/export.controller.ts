import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MESSAGES } from 'src/shared/constants/messages.constants';
import { ResponseMessage } from 'src/shared/decorators/message.decorator';
import { Public } from 'src/shared/decorators/public.decorator';
import { FindAllQueryDTO } from 'src/shared/dtos/requests/find-all-query.request';
import { GetAllExportBloodResponseDto } from './dtos/response/get_all_export_bloods.response';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { BloodExportService } from './export.service';
import { GetExportBloodResponseDto } from './dtos/response/get_export_bloods.response';
import { CreateExportBloodResponseDto } from './dtos/response/create_export_bloods.response';
import { CreateExportBloodDto } from './dtos/request/create_export.request';
import { UpdateExportBloodResponseDto } from './dtos/response/export_donate_bloods.response';
import { UpdateExportBloodDto } from './dtos/request/update_export.request';
import { DeleteByIdExportBloodDTO } from './dtos/response/delete_export_bloods.response';
import { Roles } from 'src/shared/decorators/role.decorator';

@ApiTags('Export Bloods')
@Controller('export-bloods')
export class BloodExportController {
  constructor(private readonly exportBloodService: BloodExportService) { }

  @ApiOperation({ summary: 'Get all export blood records with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Fetched export blood records successfully',
    type: GetAllExportBloodResponseDto,
  })
  @ResponseMessage(MESSAGES.DONATE_BLOOD.RETRIEVE_ALL_SUCCESS)
  @Get()
  @Public()
  @ResponseMessage("Fetch user by filter")
  findAll(@Query() query: FindAllQueryDTO) {
    return this.exportBloodService.findAll(+query.current, +query.pageSize, query.qs);
  }

  @ApiOperation({ summary: 'Get export blood record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Fetched export blood record successfully',
    type: GetExportBloodResponseDto,
  })
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiResponse({ status: 404, description: 'Export blood record not found' })
  @ResponseMessage(MESSAGES.DONATE_BLOOD.RETRIEVE_ONE_SUCCESS)
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.exportBloodService.findOne(id);
  }

  @Roles('ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Create a new export blood record' })
  @ApiResponse({
    status: 201,
    description: 'Export blood record created successfully',
    type: CreateExportBloodResponseDto,
  })
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ResponseMessage("Created export blood record successfully")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @Post()
  async create(@Body() dto: CreateExportBloodDto) {
    return await this.exportBloodService.create(dto);
  }

  @Roles('ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Update a export blood record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Export blood record updated successfully',
    type: UpdateExportBloodResponseDto,
  })
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ResponseMessage("Updated export blood record successfully")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateExportBloodDto) {
    return await this.exportBloodService.update(id, dto);
  }

  @Roles('ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Delete a export blood record by ID' })
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOkResponse({type: DeleteByIdExportBloodDTO})
  @ResponseMessage("Deleted export blood record successfully")
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.exportBloodService.remove(id);
  }
}
