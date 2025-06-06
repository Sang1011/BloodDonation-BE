import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { CreateDonateBloodDto } from 'src/donate_bloods/dto/request/create_donate_bloods.dto';
import { RegisterUserDTO } from 'src/users/dto/requests/create-user.dto';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendRegisterEmail(user: RegisterUserDTO) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: `Verify your account`,
            template: './register',
            context: { // ✏️ filling curly brackets with content
                name: user.fullname,
                url: "https://giotmauvang.org.vn/"
              },
        });
    }

    async sendSuccessDonateEmail(donateInfo: any) {
        await this.mailerService.sendMail({
            to: donateInfo.email,
            subject: `Verify your account`,
            template: './blood-donation',
            
        });
    }
}




