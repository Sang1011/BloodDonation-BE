import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BloodsService } from './bloods.service';
import { BloodDto } from './dto/request/blood.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/shared/decorators/message.decorator';
import { Blood } from './schemas/blood.schema';
import { MESSAGES } from 'src/shared/constants/messages.constants';
import { Public } from 'src/shared/decorators/public.decorator';
import { FindAllQueryDTO } from 'src/shared/dtos/requests/find-all-query.request';

@Controller('bloods')
@ApiTags('Bloods')
export class BloodsController {
    constructor(private readonly bloodsService: BloodsService) { }

    @Post()
    @ApiBearerAuth('access-token')
    @ApiSecurity('access-token')
    @ApiOperation({ summary: 'Create a new blood' })
    @ApiCreatedResponse({ type: BloodDto, description: MESSAGES.BLOOD.CREATE_SUCCESS })
    @ResponseMessage(MESSAGES.BLOOD.CREATE_SUCCESS)
    async create(@Body() bloodDto: BloodDto) {
        return this.bloodsService.create(bloodDto);
    }

    @Get()
    @Public()
    @ResponseMessage("Fetch all bloods")
    @ApiOperation({ summary: 'Fetch all bloods' })
    findAll(@Query() query: FindAllQueryDTO) {
        return this.bloodsService.findAll(+query.current, +query.pageSize, query.qs);
    }

    @Get(':id')
    @ApiBearerAuth('access-token')
    @ApiSecurity('access-token')
    @ResponseMessage("Get a blood by id")
    @ApiOperation({ summary: 'Get a blood by id' })
    @ApiOkResponse()
    async findOne(@Param('id') id: string) {
        return this.bloodsService.findOne(+id);
    }
}
