import { Controller, Get, Param } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get(':id')
  getCurrentSchedAttendance(@Param('id') class_id: string) {
    return this.attendanceService.getCurrentSchedAttendance(class_id);
  }
}
