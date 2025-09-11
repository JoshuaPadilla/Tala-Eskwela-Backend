import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { StudentsService } from '../users/students/students.service';
import { Cache } from '@nestjs/cache-manager';
import { NotificationsService } from 'src/notifications/notifications.service';

// 957ac17f-0860-49a3-a04e-c31a98ec929b - student

@Injectable()
export class AttendanceService {
  constructor(
    private readonly studentService: StudentsService,
    private readonly notificationsService: NotificationsService,
    @Inject('CACHE_MANAGER') private cache: Cache,
  ) {}

  async newAttendance(uuid: string) {
    const student = await this.studentService.findByRfidUid(uuid);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    this.notificationsService.sendAttendanceNotification([student.push_token]);
  }
}
