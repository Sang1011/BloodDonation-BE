import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { LocationsModule } from './locations/location.module';
import { RolesModule } from './roles/role.module';
import { AuthModule } from './auth/auth.module';
import { BloodTypesModule } from './blood_types/blood_types.module';
import { RhsModule } from './rhs/rhs.module';
import { BloodsModule } from './bloods/bloods.module';
import { InforHealthsModule } from './InforHealths/infor-healths.module';
import { CentralBloodModule } from './central_bloods/central_blood.module';
import { StorageModule } from './storages/storage.module';
import { DonateBloodModule } from './donate_bloods/donate_bloods.module';
import { ReceiverBloodModule } from './receiver_bloods/receiver.module';
import { BloodExportModule } from './blood_exports/export.module';
import { CentralStorageModule } from './central_blood_storage/central_blood_storage.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { EmailModule } from './email/email.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UploadModule } from './upload/upload.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { NewsModule } from './news/news.module';
import { WorkingHoursModule } from './working_hours/working_hours.module';
import { SearchModule } from './search/search.module';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
     ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    UsersModule,
    LocationsModule,
    RolesModule,
    BloodTypesModule,
    RhsModule,
    BloodsModule,
    InforHealthsModule,
    CentralBloodModule,
    StorageModule,
    CentralStorageModule,
    ReceiverBloodModule, 
    BloodExportModule,
    DonateBloodModule,
    ChatbotModule,
    EmailModule,
    CloudinaryModule,
    UploadModule,
    NewsModule,
    WorkingHoursModule,
    SearchModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}