import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { StudentsModule } from '../users/students/students.module';
import { AppModule } from 'src/app.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { ClassService } from '../class/class.service';
import { ClassModule } from '../class/class.module';
import { AttendanceController } from './attendance.controller';

@Module({
  providers: [AttendanceService],
  controllers: [AttendanceController],
  imports: [
    TypeOrmModule.forFeature([Attendance]),
    StudentsModule,
    NotificationsModule,
    ClassModule,
  ],
  exports: [AttendanceService],
})
export class AttendanceModule {}
