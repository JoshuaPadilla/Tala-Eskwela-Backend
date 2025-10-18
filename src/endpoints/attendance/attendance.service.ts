import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StudentsService } from '../users/students/students.service';
import { Cache } from '@nestjs/cache-manager';
import { NotificationsService } from 'src/notifications/notifications.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { ATTENDANCE_STATUS } from 'src/enums/attendance-status.enum';
import { RfidTapGateway } from 'src/gateways/rfid-tap-.gateway';
import { ClassService } from '../class/class.service';
import { Schedule } from '../schedule/entities/schedule.entity';
import { ParentsService } from '../users/parents/parents.service';
import { timeToDisplay } from 'src/common/helpers/time.helpers';

// 957ac17f-0860-49a3-a04e-c31a98ec929b - student

@Injectable()
export class AttendanceService {
  constructor(
    private readonly studentService: StudentsService,
    private readonly classService: ClassService,
    private readonly parentService: ParentsService,
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

    const parent = student.parent;

    const classObj = await this.classService.findById(student.class?.id, [
      'schedules',
      'schedules.subject',
    ]);

    if (!classObj) {
      throw new NotFoundException(
        'This student is not yet enrolled in any of the class',
      );
    }

    const currentSchedule = this.getCurrentSchedule(classObj.schedules);

    if (!currentSchedule) {
      throw new ForbiddenException('No Schedule within this time');
    }
    const status = this.getStatus(currentSchedule);


    const newAttendance = this.attendanceRepository.create({
      class: classObj,
      student: student,
      status: status,
    });

    const savedAttendance = await this.attendanceRepository.save(newAttendance);

    if (student.push_token) {
      this.notificationsService.sendAttendanceNotification(
        [student.push_token],
        {
          body: `${timeToDisplay(currentSchedule.start_time)} - ${timeToDisplay(currentSchedule.end_time)}`,
          title: `${currentSchedule.subject.name}`,
        },
      );
    }

    if (parent && parent.push_token) {
      this.notificationsService.sendAttendanceNotification(
        [parent.push_token],
        {
          body: `${currentSchedule.start_time} - ${currentSchedule.end_time}`,
          title: `${currentSchedule.subject.name}`,
        },
      );
    }

    return savedAttendance;
  }

  async findAll(query: Partial<Attendance>) {
    const qb = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.class', 'class');

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'class' && value === 'null') {
          // special case → advisory_class is NULL
          qb.andWhere('attendance.class IS NULL');
        } else {
          qb.andWhere(`attendance.${key} = :${key}`, { [key]: value });
        }
      }
    });

    return qb.getMany();
  }

  async getCurrentSchedAttendance(class_id: string) {
    const classObj = await this.classService.findById(class_id);

    if (!classObj) throw new NotFoundException('No class found');

    const currentClassAttendance = await this.attendanceRepository
      .createQueryBuilder('attendance') // Start building query for the Attendance entity, aliased as 'attendance'
      .leftJoinAndSelect('attendance.class', 'class')
      .leftJoinAndSelect('attendance.student', 'student') // Explicitly join the 'class' relation and select its data, aliased as 'class'
      .where('class.id = :classId', { classId: classObj.id }) // Filter based on the ID of the joined 'class' table
      .getMany(); // Execute the query and get an array of results

    return currentClassAttendance;
  }

  async getAttendanceByCurrentSched(class_id: string, schedule_id?: string) {
    const classObj = await this.classService.findById(class_id);

    if (!classObj) throw new NotFoundException('No class found');

    const schedAllAttendance = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.class', 'class')
      .leftJoinAndSelect('attendance.student', 'student')
      .leftJoinAndSelect('class.schedules', 'schedules')
      .where('class.id = :classId', { classId: classObj.id })
      .andWhere('schedules.id = :scheduleId', { scheduleId: schedule_id }) // fixed here
      .getMany();

    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate() - 1;
    const currentSchedAttendance = schedAllAttendance.filter((att) => {
      const attMonth = att.timestamp.getMonth();
      const attDate = att.timestamp.getDate();

      return attMonth === currentMonth && attDate === currentDate;
    });

    return currentSchedAttendance;
  }

  private getCurrentSchedule(schedules: Schedule[]) {
    const now = new Date();

    const currentDay = new Date()
      .toLocaleString('en-US', { weekday: 'long' })
      .toLowerCase();

    return schedules.find((schedule) => {
      if (schedule.day_of_week.toLowerCase() !== currentDay) return undefined;

      const today = new Date().toISOString().split('T')[0];
      const start = new Date(`${today}T${schedule.start_time}`);
      const end = new Date(`${today}T${schedule.end_time}`);

      return start <= now && end >= now;
    });
  }

  private getStatus(currentSchedule: Schedule) {
    const now = new Date();

    const today = new Date().toISOString().split('T')[0];
    const start = new Date(`${today}T${currentSchedule.start_time}`);

    const end = new Date(`${today}T${currentSchedule.end_time}`);

    let status = ATTENDANCE_STATUS.ABSENT;

    // const isBetweenSchedHours = now.getHours()

    const diffMinutes = now.getMinutes() - start.getMinutes();

    if (now.getHours() - end.getHours() > 0) return ATTENDANCE_STATUS.ABSENT;

    // console.log('Now:', now);
    // console.log('now is greater than:', now.getTime() > start.getTime());
    // console.log('now is less than:', now.getTime() < start.getTime());
    // console.log(now.getTime() - start.getTime());
    // console.log(diffMinutes);
    // console.log('NOW:', now.getTime());
    // console.log('START:', start.getTime());

    if (diffMinutes <= 0) {
      status = ATTENDANCE_STATUS.PRESENT; // early or exact
    } else if (diffMinutes <= 10) {
      status = ATTENDANCE_STATUS.PRESENT;
    } else if (diffMinutes <= 20) {
      status = ATTENDANCE_STATUS.LATE;
    } else if (diffMinutes > 30 && now <= end) {
      status = ATTENDANCE_STATUS.ABSENT;
    }

    return status;
  }
}
