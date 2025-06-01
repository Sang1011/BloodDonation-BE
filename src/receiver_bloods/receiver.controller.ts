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
import { ApiTags, ApiResponse, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { MESSAGES } from 'src/shared/constants/messages.constants';
import { ResponseMessage } from 'src/shared/decorators/message.decorator';
import { Public } from 'src/shared/decorators/public.decorator';
import { FindAllQueryDTO } from 'src/shared/dtos/requests/find-all-query.request';
import { ReceiverBloodService } from './receiver.service';
import { GetAllReceiveBloodResponseDto } from './dtos/responses/get_all_receive_bloods.response';
import { GetReceiveBloodResponseDto } from './dtos/responses/get_receive_bloods.response';
import { CreateReceiveBloodResponseDto } from './dtos/responses/create_receive_bloods.response';
import { CreateReceiveBloodDto } from './dtos/requests/create_receive_bloods.dto';
import { UpdateReceiveBloodResponseDto } from './dtos/responses/update_receive_bloods.response';
import { UpdateReceiveBloodDto } from './dtos/requests/update_receive_bloods.dto';

@ApiTags('Receiver Bloods')
@Controller('receiver-bloods')
export class ReceiveBloodController {
  constructor(private readonly receiveBloodService: ReceiverBloodService) {}

  @ApiOperation({ summary: 'Get all receive blood records with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Fetched receive blood records successfully',
    type: GetAllReceiveBloodResponseDto,
  })
  @ResponseMessage(MESSAGES.DONATE_BLOOD.RETRIEVE_ALL_SUCCESS)
  @Get()
    @Public()
    @ResponseMessage("Fetch user by filter")
    findAll(@Query() query: FindAllQueryDTO) {
    return this.receiveBloodService.findAll(+query.current, +query.pageSize, query.qs);
  }

  @ApiOperation({ summary: 'Get receive blood record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Fetched receive blood record successfully',
    type: GetReceiveBloodResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Receive blood record not found' })
  @ResponseMessage(MESSAGES.DONATE_BLOOD.RETRIEVE_ONE_SUCCESS)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.receiveBloodService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new receive blood record' })
  @ApiResponse({
    status: 201,
    description: 'Receive blood record created successfully',
    type: CreateReceiveBloodResponseDto,
  })
  @ResponseMessage(MESSAGES.DONATE_BLOOD.CREATE_SUCCESS)
  @Post()
  async create(@Body() dto: CreateReceiveBloodDto) {
    return await this.receiveBloodService.create(dto);
  }

  @ApiOperation({ summary: 'Update a receive blood record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Receive blood record updated successfully',
    type: UpdateReceiveBloodResponseDto,
  })
  @ResponseMessage(MESSAGES.DONATE_BLOOD.UPDATE_SUCCESS)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateReceiveBloodDto) {
    return await this.receiveBloodService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a receive blood record by ID' })
  @ApiResponse({
    status: 204,
    description: 'Receive blood record deleted successfully',
  })

  @ResponseMessage("Receiver Blood record deleted successfully")
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.receiveBloodService.remove(id);
}
}
