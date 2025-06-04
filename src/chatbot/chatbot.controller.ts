import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ApiTags } from '@nestjs/swagger';
import { AskMessageDto } from './dto/chatbot.dto';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('ask')
  async ask(@Body() askMessageDto: AskMessageDto) {
    return this.chatbotService.askAI(askMessageDto.message);
  }
}
