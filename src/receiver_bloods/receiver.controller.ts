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

  @ApiOperation({ summary: 'Lấy danh sách tất cả các bản ghi nhận máu' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách tất cả các bản ghi nhận máu thành công',
    type: GetAllReceiveBloodResponseDto,
  })
  @ResponseMessage(MESSAGES.RECEIVE_BLOOD.RETRIEVE_ALL_SUCCESS)
  @Get()
  @Public()
  @ResponseMessage("Fetch user by filter")
  async findAll(@Query() query: FindAllQueryDTO) {
    return await this.receiveBloodService.findAll(+query.current, +query.pageSize, query.qs);
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết một bản ghi nhận máu' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin chi tiết một bản ghi nhận máu thành công',
    type: GetReceiveBloodResponseDto,
  })

  @ApiOperation({ summary: 'Get all receive blood by user ID' })
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @Get('/history')
  async getAllReceiveBloodByUser(@User() user: IUser) {
    //console.log(user);
    return await this.receiveBloodService.getAllReceiveBloodByUser(user.user_id);
  }
  

  @ApiOperation({ summary: 'Create a new receive blood record' })
  @ApiResponse({
    status: 201,
    description: 'Receive blood record created successfully',
    type: CreateReceiveBloodResponseDto,
  })
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ResponseMessage(MESSAGES.RECEIVE_BLOOD.CREATE_SUCCESS)
  @Post()
  async create(@Body() dto: CreateReceiveBloodDto, @User() user: IUser) {
    return await this.receiveBloodService.create(user, dto);
  }

  @ApiOperation({ summary: 'Update a receive blood record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Receive blood record updated successfully',
    type: UpdateReceiveBloodResponseDto,
  })
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ResponseMessage(MESSAGES.RECEIVE_BLOOD.UPDATE_SUCCESS)
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
  async remove(@User() user: IUser, @Param('receiver_id') receiver_id: string): Promise<void> {
    await this.receiveBloodService.remove(user,receiver_id);
  }

  // @ApiOperation({ summary: 'Cancel schedule by ID' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Cancle receive schedule successfully',
  //   type: UpdateReceiveBloodResponseDto,
  // })
  // @ApiBearerAuth('access-token')
  // @ApiSecurity('access-token')
  // @ResponseMessage(MESSAGES.RECEIVE_BLOOD.CANCELLED_SUCESS)
  // @Patch('cancel-receive-schedule/:receiver_id')
  // async cancel(@User() user: IUser, @Param('receiver_id') receiver_id: string): Promise<void> {
  //   await this.receiveBloodService.cancelSchedule(user, receiver_id);
  // }

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
    @Get('user/:email')
    async getListReceiveByUser(@Param('email') email: string) {
      return await this.receiveBloodService.getListReceiveByUser(email);
    }

  

  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiResponse({ status: 404, description: 'Receive blood record not found' })
  @ResponseMessage(MESSAGES.RECEIVE_BLOOD.RETRIEVE_ONE_SUCCESS)
  @Get(':receiver_id')
  async findOne(@Param('receiver_id') receiver_id: string) {
    console.log(receiver_id);
    return await this.receiveBloodService.findOne(receiver_id);
  }
}
