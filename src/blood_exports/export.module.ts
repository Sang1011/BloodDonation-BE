import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InforHealthsModule } from 'src/InforHealths/infor-healths.module';
import { BloodsModule } from 'src/bloods/bloods.module';
import { CentralBloodModule } from 'src/central_bloods/central_blood.module';
import { BloodExport, BloodExportSchema } from './schemas/blood_export.schema';
import { BloodExportService } from './export.service';
import { BloodExportController } from './export.controller';
import { StorageModule } from 'src/storages/storage.module';
import { ReceiverBloodModule } from 'src/receiver_bloods/receiver.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BloodExport.name, schema: BloodExportSchema },
    ]), StorageModule, ReceiverBloodModule
  ],
  controllers: [BloodExportController],
  providers: [BloodExportService],
  exports: [BloodExportService],
})
export class BloodExportModule {}