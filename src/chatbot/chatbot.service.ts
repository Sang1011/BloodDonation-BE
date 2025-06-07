import { Injectable } from '@nestjs/common';
import { ChatbotAgent } from './agent/chatbot.agent';

@Injectable()
export class ChatbotService {
  constructor(private readonly agent: ChatbotAgent) {}

  async askAI(message: string): Promise<any> {
    return this.agent.handleMessage(message);
  }
}
