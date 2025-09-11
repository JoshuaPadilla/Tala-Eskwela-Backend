import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'; // Corrected import for Socket

@WebSocketGateway({ cors: '*' })
export class RfidTapGateway {
  @WebSocketServer()
  server;

  handleConnection(client: Socket) {
    console.log(`A new client connected: ${client.id}`);
  }

  handleRfidTap(rfid_tag_uid: string) {
    this.server.emit('tapped', { data: rfid_tag_uid });
  }
}
