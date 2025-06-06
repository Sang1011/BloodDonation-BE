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
    InforHealthsModule,
    ReceiverBloodModule, 
    BloodExportModule,
    DonateBloodModule,
    ChatbotModule,
    EmailModule,
  ],
})
export class AppModule {}
