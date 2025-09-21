import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  createSchedule(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.createSchedule(createScheduleDto);
  }

  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  deleteSchedule(@Param('id') id: string) {
    this.scheduleService.deleteSchedule(id);
  }
}
