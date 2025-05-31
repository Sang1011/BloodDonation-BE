import { Controller, Post, Body, Patch, Param  } from '@nestjs/common';
import { RhsService } from './rhs.service';
import { RhsDto } from './dto/rhs.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/shared/decorators/message.decorator';
import { MESSAGES } from 'src/shared/constants/messages.constants';

@Controller('rhs')
@ApiTags('Rhs')
export class RhsController {
    constructor(private readonly rhsService: RhsService) {}

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
}