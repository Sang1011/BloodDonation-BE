import { PartialType } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-noti.request';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}
