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
    BloodTypesModule,
    RhsModule,
    BloodsModule,
    InforHealthsModule,
    // AuthModule
  ],
})
export class AppModule {}
