import { Inject, Injectable } from '@nestjs/common';
import { AttendanceService } from '../attendance/attendance.service';
import { Cache } from 'cache-manager';
import { RFID_MODE } from 'src/enums/rfid_mode.enum';
import { StudentsService } from '../users/students/students.service';
import { RfidTapGateway } from 'src/gateways/rfid-tap-.gateway';
import { AttendanceGateway } from 'src/gateways/attendance-gateway';

@Injectable()
export class RfidService {
  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly studentService: StudentsService,
    private readonly rfidTapGateway: RfidTapGateway,
    private readonly attendanceGateway: AttendanceGateway,
    @Inject('CACHE_MANAGER') private cache: Cache,
  ) {}

  async rfid_tap(rfid_tag_uid: string) {
    const value = await this.cache.get('rfid_mode');

    if (value === RFID_MODE.REGISTER) {
      await this.studentService.registerStudentUuid(rfid_tag_uid);

      this.rfidTapGateway.handleRfidTap(rfid_tag_uid);
    } else {
      const student = await this.studentService.findByRfidUid(rfid_tag_uid);

      this.rfidTapGateway.handleEmitStudentInfo(student);

      const newAttendance =
        await this.attendanceService.createAttendance(rfid_tag_uid);

      this.attendanceGateway.handleEmitNewAttendance(newAttendance);
    }
  }
}
