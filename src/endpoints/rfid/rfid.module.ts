import { Module } from '@nestjs/common';
import { RfidService } from './rfid.service';
import { RfidController } from './rfid.controller';
import { StudentsService } from 'src/endpoints/users/students/students.service';
import { StudentsModule } from 'src/endpoints/users/students/students.module';
import { AttendanceModule } from '../attendance/attendance.module';
import { RfidTapGateway } from 'src/gateways/rfid-tap-.gateway';
import { AttendanceGateway } from 'src/gateways/attendance-gateway';

@Module({
  controllers: [RfidController],
  providers: [RfidService, RfidTapGateway, AttendanceGateway],
  imports: [StudentsModule, AttendanceModule, StudentsModule],
})
export class RfidModule {}
