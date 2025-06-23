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
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiOkResponse, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
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
import { DeleteByIdReceiveBloodDTO } from './dtos/responses/delete_receive_bloods.response';
import { User } from 'src/shared/decorators/users.decorator';
import { IUser } from 'src/shared/interfaces/user.interface';

@ApiTags('Receiver Bloods')
@Controller('receiver-bloods')
export class ReceiveBloodController {
  constructor(private readonly receiveBloodService: ReceiverBloodService) { }

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
  

  @ApiOperation({ summary: 'Create a new receive blood record' })
  @ApiResponse({
    status: 201,
    description: 'Receive blood record created successfully',
    type: CreateReceiveBloodResponseDto,
  })
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ResponseMessage(MESSAGES.DONATE_BLOOD.CREATE_SUCCESS)
  @Post()
  async create(@Body() dto: CreateReceiveBloodDto, @User() user: IUser) {
    return await this.receiveBloodService.create(user.user_id, dto);
  }

  @ApiOperation({ summary: 'Update a receive blood record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Receive blood record updated successfully',
    type: UpdateReceiveBloodResponseDto,
  })
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ResponseMessage(MESSAGES.DONATE_BLOOD.UPDATE_SUCCESS)
  @Patch(':receiver_id')
  async update(@Param('receiver_id') receiver_id: string, @Body() dto: UpdateReceiveBloodDto) {
    return await this.receiveBloodService.update(receiver_id, dto);
  }

  @ApiOperation({ summary: 'Delete a receive blood record by ID' })
  @ApiResponse({
    status: 204,
    description: 'Receive blood record deleted successfully',
  })
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOkResponse({type: DeleteByIdReceiveBloodDTO})
  @ResponseMessage("Receiver Blood record deleted successfully")
  @Delete(':receiver_id')
  async remove(@Param('receiver_id') receiver_id: string): Promise<void> {
    await this.receiveBloodService.remove(receiver_id);
  }

  @ApiOperation({ summary: 'Get list receive blood by central blood ID' })
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @Get('central-blood/:centralBlood_id')
  async getListReceiveByCentralBlood(@Param('centralBlood_id') centralBlood_id: string) {
    return await this.receiveBloodService.getListReceiveByCentralBlood(centralBlood_id);
  }

  @ApiOperation({ summary: 'Get list receive blood by user email' })
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @Get('/:email')
  async getListReceiveByUser(@Param('email') email: string) {
    return await this.receiveBloodService.getListReceiveByUser(email);
  }

  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiResponse({ status: 404, description: 'Receive blood record not found' })
  @ResponseMessage(MESSAGES.DONATE_BLOOD.RETRIEVE_ONE_SUCCESS)
  @Get(':receiver_id')
  async findOne(@Param('receiver_id') receiver_id: string) {
    return await this.receiveBloodService.findOne(receiver_id);
  }
}
