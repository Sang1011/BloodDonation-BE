// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   MessageBody,
//   ConnectedSocket,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { ChatbotService } from './chatbot.service';
// import { JwtService } from '@nestjs/jwt';

// @WebSocketGateway({
//   cors: { origin: '*' },
// })
// export class ChatbotGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   constructor(
//     private readonly chatbotService: ChatbotService,
//     private readonly jwtService: JwtService,
//   ) {}

//   async handleConnection(client: Socket) {
//     try {
//       const token = client.handshake.auth.token; 

//       if (!token) {
//         client.disconnect();
//         return;
//       }

//       const payload = this.jwtService.verify(token);

//       client.data.userId = payload.sub;

//       console.log(`User ${client.data.userId} connected via socket ${client.id}`);
//     } catch (error) {
//       console.log('Socket authentication failed:', error.message);
//       client.disconnect();
//     }
//   }

//   handleDisconnect(client: Socket) {
//     console.log(`Client disconnected: ${client.id}`);
//   }

//   @SubscribeMessage('askAI')
//   async onAskAI(
//     @MessageBody() data: { message: string },
//     @ConnectedSocket() client: Socket,
//   ) {
//     const reply = await this.chatbotService.askAI(data.message);
//     client.emit('aiReply', { message: reply });
//   }
// }

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

  constructor(private readonly chatbotService: ChatbotService) {}

  async handleConnection(client: Socket) {
    try {
       this.logger.log(`Client connected: ${client.id}`);
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
    const reply = await this.chatbotService.askAI(data.message);
    client.emit('aiReply', { message: reply });
  }
}
