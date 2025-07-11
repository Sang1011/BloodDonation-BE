import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatbotService } from './chatbot.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: '/chatbot', cors: true })
export class ChatbotGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  

  private readonly logger = new Logger(ChatbotGateway.name);
  private userID: string = "";

  constructor(private readonly chatbotService: ChatbotService) {}

  async handleConnection(client: Socket) {
  try {
    this.userID = client.handshake.auth.userID as string;
    this.logger.log(`Client connected: ${client.id} (userID: ${this.userID})`);
    
    client.data.userID = this.userID;
  } catch (error) {
    this.logger.log('Socket connection error:', error.message);
    client.disconnect();
  }
}

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('askAI')
  async onAskAI(
    @MessageBody() data: { message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const reply = await this.chatbotService.askAI(this.userID, data.message);
    client.emit('aiReply', { message: reply });
  }
}
