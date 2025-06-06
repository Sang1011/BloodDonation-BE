import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { EmailController } from './email.controller';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
           host: configService.get<string>('MAILER_HOST'),
          //  port: parseInt(configService.get<string>('MAILER_PORT')),
          secure: false,
          auth: {
             user: configService.get<string>('MAILER_USER'),
             pass: configService.get<string>('MAILER_PASSWORD'),
          },
        },
        defaults: {
            from: `${configService.get<string>('MAILER_FROM')}`,
          },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        }
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
  
})
export class EmailModule {}
