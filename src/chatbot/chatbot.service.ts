import { Injectable } from '@nestjs/common';
import { ChatbotAgent } from './agent/chatbot.agent';
import { IUser } from 'src/shared/interfaces/user.interface';

@Injectable()
export class ChatbotService {
  constructor(private readonly agent: ChatbotAgent) {}

  async askAI(userId: string, message: string): Promise<any> {
    return this.agent.handleMessage(userId, message);
  }
}
