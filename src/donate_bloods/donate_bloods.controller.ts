import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Patch,
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
import { DeleteByIdDonateBloodDTO } from './dto/response/delete_donate_bloods.response';
import { IUser } from 'src/shared/interfaces/user.interface';
import { User } from 'src/shared/decorators/users.decorator';

@ApiTags('Donate Bloods')
@Controller('donate-bloods')
export class DonateBloodController {
  constructor(private readonly donateBloodService: DonateBloodService) { }

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



  @ApiOperation({ summary: 'Create a new donate blood record' })
  @ApiResponse({
    status: 201,
    description: 'Donate blood record created successfully',
    type: CreateDonateBloodResponseDto,
  })
  @ResponseMessage(MESSAGES.DONATE_BLOOD.CREATE_SUCCESS)
  @Post()
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  async create( @User() user: IUser,@Body() dto: CreateDonateBloodDto) {
    return await this.donateBloodService.create(user, dto);
  }

  @ApiOperation({ summary: 'Update a donate blood record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Donate blood record updated successfully',
    type: UpdateDonateBloodResponseDto,
  })
  @ResponseMessage(MESSAGES.DONATE_BLOOD.UPDATE_SUCCESS)
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  async update(@Param('id') id: string, @Body() dto: UpdateDonateBloodDto) {
    return await this.donateBloodService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a donate blood record by ID' })
  @ResponseMessage(MESSAGES.DONATE_BLOOD.DELETE_SUCCESS)
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOkResponse({type: DeleteByIdDonateBloodDTO})
  async remove(@Param('id') id: string): Promise<void> {
    await this.donateBloodService.remove(id);
  }

  @Get('history/user')
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  async historyDonate(@User() user: IUser) {
    return await this.donateBloodService.getDonateBlood(user);
  }

  @Get('/history/email')
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  async findCustomerDonate(@Query('email') email: string) {
    return await this.donateBloodService.getDonateBloodByEmail(email);
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
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  async findOne(@Param('id') id: string) {
    return await this.donateBloodService.findOne(id);
  }
}
