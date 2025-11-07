import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { CreateDonateBloodDto } from 'src/donate_bloods/dto/request/create_donate_bloods.dto';
import { RegisterUserDTO } from 'src/users/dto/requests/create-user.dto';
import { User } from 'src/users/schemas/user.schema';
import { SendDonateBloodDTO } from './dtos/send_donate_info';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  async sendRegisterEmail(user: RegisterUserDTO) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: `Verify your account`,
      template: './register',
      context: {
        name: user.fullname,
        url: "https://giotmauvang.org.vn/"
      },
    });
  }

  async sendEmailToResetRequest(email: string, digitCode: number) {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Reset Request',
        template: './send-reset-code',
        context: {
          digitCode: digitCode,
        }
      })
  }

  async sendSuccessDonateEmail(donateInfo: SendDonateBloodDTO) {
    await this.mailerService.sendMail({
      to: donateInfo.email,
      subject: `Verify your account`,
      template: './blood-donation',
    });
  }

  async sendVerifyEmail(user: RegisterUserDTO) {
    const token = crypto.randomUUID();

    // Cập nhật token và trạng thái vào DB
    await this.userModel.updateOne(
      { email: user.email },
      { $set: { verify_token: token, is_verified: false } }
    );

    // Gửi email
    await this.mailerService.sendMail({
      to: user.email,
      subject: `Verify your account`,
      template: './verify-email',
      context: {
        name: user.fullname,
        url: `https://prm-blood-donation-be-production.up.railway.app/api/v1/auth/verify-email?email=${encodeURIComponent(user.email)}&token=${token}`,
        token: token,
        email: user.email,
      }
    });
  }
}




