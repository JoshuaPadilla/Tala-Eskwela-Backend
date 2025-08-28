import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io-client';

@WebSocketGateway({ cors: '*' })
export class AttendanceGateway {
  @WebSocketServer()
  server;

  handleConnection(client: Socket) {
    console.log(`A new client connected: ${client.id}`);
  }

  handleRfidTap() {
    this.server.emit('rfidTap', { message: 'new student' });
  }
}
