import { forwardRef, Inject, Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';

@WebSocketGateway({ cors: true, namespace: '/noti' })
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private users = new Map<string, Socket>();

  constructor(
    @Inject(forwardRef(() => NotificationService))
    private readonly notiService: NotificationService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    client.on('register', (data: { user_id: string }) => {
      if (data?.user_id) {
        this.users.set(data.user_id, client);
        this.logger.log(`Registered ${data.user_id} to socket ${client.id}`);
      } else {
        client.emit('register_error', { message: 'user_id is required' });
      }
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Remove any user mapping with this socket
    for (const [userId, socket] of this.users.entries()) {
      if (socket.id === client.id) {
        this.users.delete(userId);
        break;
      }
    }
  }

  // Dùng bởi NotificationService
  sendToUser(user_id: string, payload: any) {
    const client = this.users.get(user_id);
    if (client) {
      client.emit('userReceive', payload);
      this.logger.log(`Real-time message sent to ${user_id}`);
    } else {
      this.logger.warn(`User ${user_id} not connected. Skipping socket emit.`);
    }
  }

  // Dùng để broadcast nếu cần
  broadcast(payload: any) {
    this.server.emit('userReceive', payload);
  }
}