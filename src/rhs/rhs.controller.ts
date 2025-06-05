import { Controller, Post, Body, Patch, Param, Get, Query } from '@nestjs/common';
import { RhsService } from './rhs.service';
import { RhsDto } from './dto/rhs.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/shared/decorators/message.decorator';
import { MESSAGES } from 'src/shared/constants/messages.constants';
import { Public } from 'src/shared/decorators/public.decorator';
import { FindAllQueryDTO } from 'src/shared/dtos/requests/find-all-query.request';

@Controller('rhs')
@ApiBearerAuth('access-token')
@ApiSecurity('access-token')
@ApiTags('Rhs')
export class RhsController {
    constructor(private readonly rhsService: RhsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new Rh' })
    @ApiOkResponse({ type: RhsDto })
    @ResponseMessage(MESSAGES.RH.CREATE_SUCCESS)
    async create(@Body() createRhDto: RhsDto) {
        return this.rhsService.create(createRhDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a Rh' })
    @ApiOkResponse({ type: RhsDto })
    @ResponseMessage(MESSAGES.RH.UPDATE_SUCCESS)
    async update(@Param('id') id: number, @Body() updateRhDto: RhsDto) {
        return this.rhsService.update(id, updateRhDto);
    }

    @Get()
    @Public()
    @ResponseMessage("Fetch all Rh")
    @ApiOperation({ summary: 'Fetch all Rh' })
    findAll(@Query() query: FindAllQueryDTO) {
        return this.rhsService.findAll(+query.current, +query.pageSize, query.qs);
    }

    @Get(":id")
    @ResponseMessage("Fetch Rh by id")
    @ApiOperation({ summary: 'Fetch Rh by id' })
    findOne(@Param("id") id: string) {
        return this.rhsService.findOne(+id);
    }
}