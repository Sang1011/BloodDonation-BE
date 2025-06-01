import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InforHealthsModule } from 'src/InforHealths/infor-healths.module';
import { BloodsModule } from 'src/bloods/bloods.module';
import { CentralBloodModule } from 'src/central_bloods/central_blood.module';
import { ReceiverBlood, ReceiverBloodSchema } from './schemas/receiver_blood.schema';
import { ReceiverBloodService } from './receiver.service';
import { ReceiveBloodController } from './receiver.controller';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReceiverBlood.name, schema: ReceiverBloodSchema },
    ]), InforHealthsModule, BloodsModule
  ],
  controllers: [ReceiveBloodController],
  providers: [ReceiverBloodService],
  exports: [ReceiverBloodService],
})
export class ReceiverBloodModule {}