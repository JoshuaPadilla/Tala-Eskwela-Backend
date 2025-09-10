import { Inject, Injectable } from '@nestjs/common';
import { StudentsService } from '../users/students/students.service';
import { Cache } from '@nestjs/cache-manager';

// 957ac17f-0860-49a3-a04e-c31a98ec929b - student

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
