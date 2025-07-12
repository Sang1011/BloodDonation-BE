import { Controller, Post, Body, Patch, Param, Get, Query, Delete } from '@nestjs/common';
import { RhsService } from './rhs.service';
import { RhsDto } from './dto/rhs.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/shared/decorators/message.decorator';
import { MESSAGES } from 'src/shared/constants/messages.constants';
import { Public } from 'src/shared/decorators/public.decorator';
import { FindAllQueryDTO } from 'src/shared/dtos/requests/find-all-query.request';
import { Roles } from 'src/shared/decorators/role.decorator';

@Controller('rhs')
@ApiTags('Rhs')
export class RhsController {
    constructor(private readonly rhsService: RhsService) { }

    @Roles('ADMIN','STAFF')
    @Post()
    @ApiBearerAuth('access-token')
    @ApiSecurity('access-token')
    @ApiOperation({ summary: 'Create a new Rh' })
    @ApiOkResponse({ type: RhsDto })
    @ResponseMessage(MESSAGES.RH.CREATE_SUCCESS)
    async create(@Body() createRhDto: RhsDto) {
        return this.rhsService.create(createRhDto);
    }

    @Roles('ADMIN','STAFF')
    @Patch(':id')
    @ApiBearerAuth('access-token')
    @ApiSecurity('access-token')
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
    @ApiBearerAuth('access-token')
    @ApiSecurity('access-token')
    @ResponseMessage("Fetch Rh by id")
    @ApiOperation({ summary: 'Fetch Rh by id' })
    findOne(@Param("id") id: string) {
        return this.rhsService.findOne(+id);
    }

    @Roles('ADMIN','STAFF')
    @Delete(":id")
    @ApiBearerAuth('access-token')
    @ApiSecurity('access-token')
    @ResponseMessage("Delete Rh by id")
    @ApiOperation({ summary: 'Delete Rh by id' })
    deketeOne(@Param("id") id: string) {
        return this.rhsService.softRemove(+id);
    }
}