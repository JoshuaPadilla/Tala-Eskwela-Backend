import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { StudentsModule } from '../users/students/students.module';
import { AppModule } from 'src/app.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  providers: [AttendanceService],
  imports: [
    TypeOrmModule.forFeature([Attendance]),
    StudentsModule,
    NotificationsModule,
  ],
  exports: [AttendanceService],
})
export class AttendanceModule {}
