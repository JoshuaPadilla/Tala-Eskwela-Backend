import { Inject, Injectable } from '@nestjs/common';
import { StudentsService } from '../users/students/students.service';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly studentService: StudentsService,
    @Inject('CACHE_MANAGER') private cache: Cache,
  ) {}

  async newAttendance(uuid: string) {
    const value = await this.cache.get('rfid_mode');
    console.log(value);
  }
}
