import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'; // Corrected import for Socket
import { Attendance } from 'src/endpoints/attendance/entities/attendance.entity';
import { Student } from 'src/endpoints/users/students/entities/student.entity';

@WebSocketGateway({ cors: '*' })
export class RfidTapGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_class')
  handleJoinClass(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { class_id: string },
  ) {
    client.join(body.class_id);
    console.log(`Client ${client.id} joined room ${body.class_id}`);
  }

  @SubscribeMessage('join_subject')
  handleJoinSubject(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { subject_id: string },
  ) {
    client.join(body.subject_id);
    console.log(`Client ${client.id} joined subject room ${body.subject_id}`);
  }

  handleConnection(client: Socket) {
    console.log(`A new client connected: ${client.id}`);
  }

  handleRfidTap(rfid_tag_uid: string) {
    this.server.emit('tapped', { data: rfid_tag_uid });
  }

  handleEmitStudentInfo(student: Student) {
    this.server.emit('studentInfo', { data: student });
  }
}
