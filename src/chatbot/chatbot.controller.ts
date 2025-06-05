import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AskMessageDto } from './dto/chatbot.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { ResponseMessage } from 'src/shared/decorators/message.decorator';

@ApiTags('Chatbot')
@ApiBearerAuth('access-token')
@ApiSecurity('access-token')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Public()
  @ResponseMessage('Trợ lý AI hỗ trợ hiến máu')
  @Post('ask')
  async ask(@Body() askMessageDto: AskMessageDto) {
    return this.chatbotService.askAI(askMessageDto.message);
  }
}
