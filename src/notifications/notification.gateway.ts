import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';

@WebSocketGateway({ cors: true })
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);

  constructor(private readonly notiService: NotificationService) { }

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

  // @SubscribeMessage('sendToUser')
  // async sendToUser(
  //   @MessageBody() data: { message: string },
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   client.emit('userReceive', { message: data });
  // }

  @SubscribeMessage('readyForNoti')
  async handleReady(@ConnectedSocket() client: Socket) {
    client.emit('userReceive', {
      message: 'Now that you are ready, here’s your noti!',
    });
  }

}


