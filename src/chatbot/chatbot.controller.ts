import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AskMessageDto } from './dto/chatbot.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { ResponseMessage } from 'src/shared/decorators/message.decorator';
import { User } from 'src/shared/decorators/users.decorator';
import { IUser } from 'src/shared/interfaces/user.interface';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}
  
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ResponseMessage('Assistant is ready to help you!')
  @Post('ask')
  async ask(@User() user: IUser, @Body() askMessageDto: AskMessageDto) {
    return this.chatbotService.askAI(user.user_id, askMessageDto.message);
  }
}