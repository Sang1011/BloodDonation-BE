import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { RolesModule } from 'src/roles/role.module';
@Module({
    imports: [UsersModule, PassportModule, RolesModule,
        JwtModule.registerAsync({
            useFactory: async (configService : ConfigService) => ({
                secret: configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
                signOptions: {
                    expiresIn: configService.get<string>("JWT_ACCESS_EXPIRE"),
                },
            }),
            inject: [ConfigService]
          }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, LocalStrategy],
    exports: [AuthService]
})
export class AuthModule {}
