import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { LocationsModule } from './locations/location.module';
import { RolesModule } from './roles/role.module';
import { AuthModule } from './auth/auth.module';
import { DonateBloodModule } from './donate_bloods/donate_bloods.module';
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
    // AuthModule,
    DonateBloodModule,

  ],
})
export class AppModule {}
