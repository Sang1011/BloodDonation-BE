import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DonateBloodController } from './donate_bloods.controller';
import { DonateBloodService } from './donate_bloods.service';
import { DonateBlood, DonateBloodSchema } from './schemas/donate_blood.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DonateBlood.name, schema: DonateBloodSchema },
    ]),
  ],
  controllers: [DonateBloodController],
  providers: [DonateBloodService],
  exports: [DonateBloodService],
})
export class DonateBloodModule {}