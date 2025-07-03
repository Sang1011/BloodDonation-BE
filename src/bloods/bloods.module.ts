import { Module } from '@nestjs/common';
import { BloodsService } from './bloods.service';
import { BloodSchema } from './schemas/blood.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Blood } from './schemas/blood.schema';
import { BloodsController } from './bloods.controller';
import { BloodTypesModule } from 'src/blood_types/blood_types.module';
import { RhsModule } from 'src/rhs/rhs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blood.name, schema: BloodSchema }]),
    BloodTypesModule,
    RhsModule,
  ],
  providers: [BloodsService],
  controllers: [BloodsController],
  exports: [BloodsService],
})
export class BloodsModule {}
