import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { ChatbotAgent } from './agent/chatbot.agent';
import { ConfigModule } from '@nestjs/config';
import { ChatbotGateway } from './chatbot.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, JwtModule],
  controllers: [ChatbotController],
  providers: [ChatbotService, ChatbotAgent, ChatbotGateway],
})
export class ChatbotModule {}
