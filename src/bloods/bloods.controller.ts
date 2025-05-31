import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BloodsService } from './bloods.service';
import { BloodDto } from './dto/request/blood.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/shared/decorators/message.decorator';
import { Blood } from './schemas/blood.schema';
import { MESSAGES } from 'src/shared/constants/messages.constants';

@Controller('bloods')
@ApiTags('Bloods')
export class BloodsController {
    constructor(private readonly bloodsService: BloodsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new blood' })
    @ApiCreatedResponse({ type: BloodDto, description: MESSAGES.BLOOD.CREATE_SUCCESS })
    @ResponseMessage(MESSAGES.BLOOD.CREATE_SUCCESS)
    async create(@Body() bloodDto: BloodDto) {
        return this.bloodsService.create(bloodDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all bloods' })
    @ApiOkResponse({description: MESSAGES.BLOOD.GET_ALL_SUCCESS})
    @ResponseMessage(MESSAGES.BLOOD.GET_ALL_SUCCESS)
    async findAll() {
        return this.bloodsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a blood by id' })
    @ApiOkResponse()
    async findOne(@Param('id') id: string) {
        return this.bloodsService.findOne(id);
    }
}
