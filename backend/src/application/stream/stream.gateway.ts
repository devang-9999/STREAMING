/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class StreamsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {}

  handleDisconnect(client: Socket) {}

  @SubscribeMessage('join')
  handleJoin(@MessageBody() userId: number, @ConnectedSocket() client: Socket) {
    void client.join(`user-${userId}`);
  }

  streamCreated(stream: any) {
    this.server.emit('streamCreated', stream);
  }

  streamUpdated(stream: any) {
    this.server.emit('streamUpdated', stream);
  }

  sendNotification(userId: number, notification: any) {
    this.server.to(`user-${userId}`).emit('notification', notification);
  }

  sendBulkNotification(userIds: number[], notification: any) {
    userIds.forEach((userId) => {
      this.server.to(`user-${userId}`).emit('notification', notification);
    });
  }
}
