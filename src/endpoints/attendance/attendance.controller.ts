import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  findAll() {
    return this.attendanceService.findAll({});
  }

  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

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

  @Patch(':id')
  updateAttendance(
    @Param('id') id: string,
    @Body() payload: Partial<Attendance>,
  ) {
    console.log('Updating...');
    return this.attendanceService.update(id, payload);
  }

  @Delete()
  deleteAll() {
    return this.attendanceService.deleteAll();
  }
}
