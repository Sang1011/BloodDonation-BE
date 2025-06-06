import { Controller, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorators/public.decorator';
import { ResponseMessage } from 'src/shared/decorators/message.decorator';
import { EmailService } from './email.service';
import { RegisterUserDTO } from 'src/users/dto/requests/create-user.dto';
import { SendDonateBloodDTO } from './dtos/send_donate_info';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Public()
  @ResponseMessage('Send email Donate Blood success')
  @Post('send-donate-blood')
  async sendDonateBlood(@Body() sendDonateInfo: SendDonateBloodDTO) {
    return this.emailService.sendSuccessDonateEmail(sendDonateInfo);
  }

  @Public()
  @ResponseMessage('Send email Register User success')
  @Post('send-cancel-donate-blood')
  async sendCancelDonateBlood(@Body() registerDTO: RegisterUserDTO) {
    return this.emailService.sendRegisterEmail(registerDTO);
  }
}
