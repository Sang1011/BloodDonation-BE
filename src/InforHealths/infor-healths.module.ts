import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InforHealth, InforHealthSchema } from './schemas/inforhealth.schema';
import { InforHealthService } from './infor-healths.service';
import { InforHealthController } from './infor-health.controller';
import { UsersModule } from 'src/users/users.module';
import { BloodsModule } from 'src/bloods/bloods.module';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: InforHealth.name, schema: InforHealthSchema }]), UsersModule, BloodsModule, UploadModule],
  controllers: [InforHealthController],
  providers: [InforHealthService],
  exports: [InforHealthService]
})
export class InforHealthsModule {}
