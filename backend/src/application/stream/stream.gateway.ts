import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class StreamsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody() userId: number,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(`user-${userId}`);
  }

  streamCreated(stream) {
    this.server.emit('streamCreated', stream);
  }

  streamUpdated(stream) {
    this.server.emit('streamUpdated', stream);
  }

  sendNotification(userId: number, notification: any) {
    this.server.to(`user-${userId}`).emit('notification', notification);
  }
}
