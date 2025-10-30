import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get(':id')
  getCurrentSchedAttendance(@Param('id') class_id: string) {
    return this.attendanceService.getCurrentSchedAttendance(class_id);
  }

  @Get('bySched/:class_id')
  getAttendanceByCurrentSchedule(
    @Param('class_id') class_id: string,
    @Query('schedule_id') schedule_id: string,
  ) {
    return this.attendanceService.getAttendanceByCurrentSched(
      class_id,
      schedule_id,
    );
  }

  @Delete()
  deleteAll() {
    return this.attendanceService.deleteAll();
  }
}
