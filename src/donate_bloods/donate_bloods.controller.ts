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
import { DonateBloodService } from './donate_bloods.service';
import { CreateDonateBloodDto } from './dto/request/create_donate_bloods.dto';
import { UpdateDonateBloodDto } from './dto/request/update_donate_bloods.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiOkResponse, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { CreateDonateBloodResponseDto } from './dto/response/create_donate_bloods.response';
import { GetDonateBloodResponseDto } from './dto/response/get_donate_bloods.response';
import { GetAllDonateBloodResponseDto } from './dto/response/get_all_donate_bloods.response';
import { UpdateDonateBloodResponseDto } from './dto/response/update_donate_bloods.response';
import { MESSAGES } from 'src/shared/constants/messages.constants';
import { ResponseMessage } from 'src/shared/decorators/message.decorator';
import { Public } from 'src/shared/decorators/public.decorator';
import { FindAllQueryDTO } from 'src/shared/dtos/requests/find-all-query.request';

@ApiTags('Donate Bloods')
@ApiBearerAuth('access-token')
@ApiSecurity('access-token')
@Controller('donate-bloods')
export class DonateBloodController {
  constructor(private readonly donateBloodService: DonateBloodService) {}

  @ApiOperation({ summary: 'Get all donate blood records with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Fetched donate blood records successfully',
    type: GetAllDonateBloodResponseDto,
  })
  @ResponseMessage(MESSAGES.DONATE_BLOOD.RETRIEVE_ALL_SUCCESS)
  @Get()
    @Public()
    @ResponseMessage("Fetch user by filter")
    findAll(@Query() query: FindAllQueryDTO) {
    return this.donateBloodService.findAll(+query.current, +query.pageSize, query.qs);
  }

  @ApiOperation({ summary: 'Get donate blood record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Fetched donate blood record successfully',
    type: GetDonateBloodResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Donate blood record not found' })
  @ResponseMessage(MESSAGES.DONATE_BLOOD.RETRIEVE_ONE_SUCCESS)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.donateBloodService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new donate blood record' })
  @ApiResponse({
    status: 201,
    description: 'Donate blood record created successfully',
    type: CreateDonateBloodResponseDto,
  })
  @ResponseMessage(MESSAGES.DONATE_BLOOD.CREATE_SUCCESS)
  @Post()
  async create(@Body() dto: CreateDonateBloodDto) {
    return await this.donateBloodService.create(dto);
  }

  @ApiOperation({ summary: 'Update a donate blood record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Donate blood record updated successfully',
    type: UpdateDonateBloodResponseDto,
  })
  @ResponseMessage(MESSAGES.DONATE_BLOOD.UPDATE_SUCCESS)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateDonateBloodDto) {
    return await this.donateBloodService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a donate blood record by ID' })
  @ApiResponse({
    status: 204,
    description: 'Donate blood record deleted successfully',
  })

  @ResponseMessage(MESSAGES.DONATE_BLOOD.DELETE_SUCCESS)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.donateBloodService.remove(id);
}
}
