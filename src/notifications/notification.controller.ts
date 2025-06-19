import { Controller, Post, Body, Patch, Param, Get, Query, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/shared/decorators/message.decorator';
import { MESSAGES } from 'src/shared/constants/messages.constants';
import { Public } from 'src/shared/decorators/public.decorator';
import { FindAllQueryDTO } from 'src/shared/dtos/requests/find-all-query.request';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dtos/requests/create-noti.request';
import { UpdateNotificationDto } from './dtos/requests/update-noti.request';

@Controller('notifications')
@ApiTags('Notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post()
    @ApiBearerAuth('access-token')
    @ApiSecurity('access-token')
    @ApiOperation({ summary: 'Create a new Noti' })
    @ResponseMessage("Created a new notification")
    async create(@Body() createNotiDto: CreateNotificationDto) {
        return this.notificationService.create(createNotiDto);
    }

    @Patch(':id')
    @ApiBearerAuth('access-token')
    @ApiSecurity('access-token')
    @ApiOperation({ summary: 'Update a notification' })
    @ResponseMessage("Update a notification")
    async update(@Param('id') id: string, @Body() updateNotiDto: UpdateNotificationDto) {
        return this.notificationService.update(id, updateNotiDto);
    }

    @Get()
    @Public()
    @ResponseMessage("Fetch all Notifications")
    @ApiOperation({ summary: 'Fetch all Notifications' })
    findAll(@Query() query: FindAllQueryDTO) {
        return this.notificationService.findAll(+query.current, +query.pageSize, query.qs);
    }

    @Get(":id")
    @ApiBearerAuth('access-token')
    @ApiSecurity('access-token')
    @ResponseMessage("Fetch a Noti by id")
    @ApiOperation({ summary: 'Fetch a Noti by id' })
    findOne(@Param("id") id: string) {
        return this.notificationService.findOne(id);
    }

    @Delete(":id")
    @ApiBearerAuth('access-token')
    @ApiSecurity('access-token')
    @ResponseMessage("Delete a Noti by id")
    @ApiOperation({ summary: 'Delete a Noti by id' })
    deketeOne(@Param("id") id: string) {
        return this.notificationService.remove(id);
    }
}