import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { LocationsModule } from './locations/location.module';
import { RolesModule } from './roles/role.module';
import { AuthModule } from './auth/auth.module';
import { CentralBloodModule } from './central_bloods/central_blood.module';
import { StorageModule } from './storages/storage.module';
import { CentralBloodStorageModule } from './central_blood_storage/central_blood_storage.module';
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
    UsersModule,
    LocationsModule,
    RolesModule,
    CentralBloodModule,
    StorageModule,
    CentralBloodStorageModule
    // AuthModule
  ],
})
export class AppModule {}
