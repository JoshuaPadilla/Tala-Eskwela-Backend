import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'; // Corrected import for Socket
import { Attendance } from 'src/endpoints/attendance/entities/attendance.entity';

@WebSocketGateway({ cors: '*' })
export class AttendanceGateway {
  @WebSocketServer()
  server: Server;

  handleNewAttendance(attendance: Attendance) {
    const class_id = attendance.class.id;

    this.server.to(class_id).emit('newAttendance', { data: attendance });
  }
}
