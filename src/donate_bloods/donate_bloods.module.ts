import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DonateBloodController } from './donate_bloods.controller';
import { DonateBloodService } from './donate_bloods.service';
import { DonateBlood, DonateBloodSchema } from './schemas/donate_blood.schema';
import { InforHealthsModule } from 'src/InforHealths/infor-healths.module';
import { BloodsModule } from 'src/bloods/bloods.module';
import { CentralBloodModule } from 'src/central_bloods/central_blood.module';
import { UsersModule } from 'src/users/users.module';
import { StorageModule } from 'src/storages/storage.module';
import { NotificationModule } from 'src/notifications/notification.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DonateBlood.name, schema: DonateBloodSchema },
    ]),
    InforHealthsModule,
    BloodsModule,
    CentralBloodModule,
    UsersModule,
    StorageModule,
    forwardRef(() => NotificationModule), 
  ],
  controllers: [DonateBloodController],
  providers: [DonateBloodService],
  exports: [DonateBloodService],
})
export class DonateBloodModule {}