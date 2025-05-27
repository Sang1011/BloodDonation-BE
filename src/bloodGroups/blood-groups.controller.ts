import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { BloodGroupsService } from './blood-groups.service';
import { ResponseMessage } from 'src/shared/decorators/message.decorator';
import { FindAllQueryDTO } from 'src/shared/dtos/requests/find-all-query.request';
import { GetAllBloodResponse, GetIdBloodResponse } from './dto/responses/blood-group.response';

@ApiTags('BloodGroups')
@Controller('blood-groups')
export class BloodGroupsController {
  constructor(private readonly bloodGroupsService: BloodGroupsService) {}

  @Get()
  @ApiOkResponse({ type: GetAllBloodResponse })
  @ResponseMessage('Fetch all blood groups')
  findAll(@Query() query: FindAllQueryDTO) {
    return this.bloodGroupsService.findAll(+query.current, +query.pageSize, query.qs);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'BloodGroup ID' })
  @ApiOkResponse({ type: GetIdBloodResponse })
  @ResponseMessage('Fetch blood group by id')
  findOne(@Param('id') id: string) {
    return this.bloodGroupsService.findOne(id);
  }
}
