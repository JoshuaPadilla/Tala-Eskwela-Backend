import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'; // Corrected import for Socket
import { AttendanceService } from 'src/endpoints/attendance/attendance.service';
import { Attendance } from 'src/endpoints/attendance/entities/attendance.entity';

@WebSocketGateway({ cors: '*' })
export class AttendanceGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly attendanceService: AttendanceService) {}

  handleEmitNewAttendance(attendance: Attendance) {
    const class_id = attendance.class.id;
    const subject = this.attendanceService.getCurrentSchedule(
      attendance.class.schedules,
    );

    console.log(subject?.id);

    this.server
      .to([class_id, subject?.id || ''])
      .emit('newAttendance', { attendance });
  }
}
