import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { StudentsService } from '../users/students/students.service';
import { Cache } from '@nestjs/cache-manager';
import { NotificationsService } from 'src/notifications/notifications.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { ATTENDANCE_STATUS } from 'src/enums/attendance-status.enum';
import { RfidTapGateway } from 'src/gateways/rfid-tap-.gateway';

// 957ac17f-0860-49a3-a04e-c31a98ec929b - student

@Injectable()
export class AttendanceService {
  constructor(
    private readonly studentService: StudentsService,
    private readonly notificationsService: NotificationsService,

    @Inject('CACHE_MANAGER') private cache: Cache,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async createAttendance(uuid: string) {
    const student = await this.studentService.findByRfidUid(uuid);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const classObj = student.class;

    if (!classObj) {
      throw new NotFoundException(
        'This student is not yet enrolled in any of the class',
      );
    }

    const newAttendance = await this.attendanceRepository.create({
      class: classObj,
      student: student,
      status: ATTENDANCE_STATUS.PRESENT,
    });

    const savedAttendance = await this.attendanceRepository.save(newAttendance);

    this.notificationsService.sendAttendanceNotification([student.push_token]);

    return savedAttendance;
  }
}
