import { Controller, Get, Param, Post, Body, Put, Query } from '@nestjs/common';
import { BloodTypesService } from './blood_types.service';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BloodTypeDto } from './dto/request/bloodtype.dto';
import { ResponseMessage } from 'src/shared/decorators/message.decorator';
import { MESSAGES } from 'src/shared/constants/messages.constants';
import { FindAllQueryDTO } from 'src/shared/dtos/requests/find-all-query.request';
import { Public } from 'src/shared/decorators/public.decorator';

@ApiTags('Blood Types')
@Controller('blood-types')
export class BloodTypesController {
    constructor(private readonly bloodTypesService: BloodTypesService) { }


    @Post()
    @ApiResponse({ status: 201, description: 'Return the created blood type' })
    @ResponseMessage(MESSAGES.BLOOD_TYPE.CREATE_SUCCESS)
    async create(@Body() bloodType: BloodTypeDto) {
        return await this.bloodTypesService.create(bloodType);
    }

    @Get()
    @Public()
    @ResponseMessage("Fetch all blood types")
    @ApiOperation({ summary: 'Fetch all blood types' })
    findAll(@Query() query: FindAllQueryDTO) {
        return this.bloodTypesService.findAll(+query.current, +query.pageSize, query.qs);
    }

    @Get(':id')
    @ResponseMessage("Fetch a blood types by id")
    @ApiOperation({ summary: 'Get a blood type by ID' })
    @ApiOkResponse({
        description: 'Get a blood type by ID',
        type: BloodTypeDto,
    })
    async findOne(@Param('id') id: number) {
        return await this.bloodTypesService.findOne(id);
    }


    @Put(':id')
    @ApiOperation({ summary: 'Update a blood type by ID' })
    @ApiOkResponse({
        description: 'Update a blood type by ID',
        type: BloodTypeDto,
    })
    @ResponseMessage(MESSAGES.BLOOD_TYPE.UPDATE_SUCCESS)
    async update(@Param('id') id: string, @Body() bloodType: BloodTypeDto) {
        return await this.bloodTypesService.update(id, bloodType);
    }

}
