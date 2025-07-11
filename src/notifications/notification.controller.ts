import { Controller, Post, Body, Patch, Param, Get, Query, Delete, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/shared/decorators/message.decorator';
import { MESSAGES } from 'src/shared/constants/messages.constants';
import { Public } from 'src/shared/decorators/public.decorator';
import { FindAllQueryDTO } from 'src/shared/dtos/requests/find-all-query.request';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dtos/requests/create-noti.request';
import { UpdateNotificationDto } from './dtos/requests/update-noti.request';
import { BroadcastNotiDto } from './dtos/requests/board-cast.request';
import { Roles } from 'src/shared/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/shared/decorators/users.decorator';
import { IUser } from 'src/shared/interfaces/user.interface';

@Controller('notifications')
@ApiTags('Notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post()
    @Roles('ADMIN')
    @ApiBearerAuth('access-token')
    @ApiSecurity('access-token')
    @ApiOperation({ summary: 'Create a new Noti' })
    @ResponseMessage("Created a new notification")
    async create(@Body() createNotiDto: CreateNotificationDto) {
        return this.notificationService.create(createNotiDto);
    }
    
    @Post("/broadcast")
    @Roles('ADMIN')
    @ApiBearerAuth('access-token')
    @ApiSecurity('access-token')
    @ApiOperation({ summary: 'Broadcast notification to all users' })
    @ResponseMessage("Broadcast notification sent")
    async broadcast(@Body() body: BroadcastNotiDto) {
        const { title, message, type } = body;
        return this.notificationService.sendNotiAllUser(title, message, type);
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

    @Roles('ADMIN')
    @Delete(":id")
    @ApiBearerAuth('access-token')
    @ApiSecurity('access-token')
    @ResponseMessage("Delete a Noti by id")
    @ApiOperation({ summary: 'Delete a Noti by id' })
    deleteOne(@Param("id") id: string) {
        return this.notificationService.remove(id);
    }

    @Patch('mark-read-all')
    @ApiBearerAuth('access-token')
    @ApiSecurity('access-token')
    @ResponseMessage("Mark all notifications as read")
    async markAllAsRead(@User() user: IUser) {
        if (!user || !user.user_id) {
            throw new BadRequestException('User not authenticated');
        }
        return this.notificationService.markAllAsRead(user.user_id);
    }

    @Patch('mark-read/:id')
    @ApiBearerAuth('access-token')
    @ApiSecurity('access-token')
    @ResponseMessage("Mark notification as read")
    async markAsRead(@User() user: IUser, @Param('id') id: string) {
        console.log("Mark read");
        return this.notificationService.markAsRead(user.user_id, id);
    }

    @Patch(':id')
    @Roles('ADMIN')
    @ApiBearerAuth('access-token')
    @ApiSecurity('access-token')
    @ApiOperation({ summary: 'Update a notification' })
    @ResponseMessage("Update a notification")
    async update(@Param('id') id: string, @Body() updateNotiDto: UpdateNotificationDto) {
        return this.notificationService.update(id, updateNotiDto);
    }
}