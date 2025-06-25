import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { DonateBloodModule } from 'src/donate_bloods/donate_bloods.module';
import { ReceiverBloodModule } from 'src/receiver_bloods/receiver.module';
import { InforHealthsModule } from 'src/InforHealths/infor-healths.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    DonateBloodModule, ReceiverBloodModule, InforHealthsModule],
    controllers: [NotificationController],   
    providers: [NotificationService, NotificationGateway],
    exports: [NotificationService],
})
export class NotificationModule {}
