import {
  BadRequestException,
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
import { arrayNotContains } from 'class-validator';
import e from 'express';
import { time } from 'console';

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
    const now = new Date();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const parent = student.parent;

    if (!student.class) {
      throw new NotFoundException('Student not yet enrolled');
    }

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

    if (
      await this.isExistingAttendance(
        student.id,
        currentSchedule.id,
        classObj.id,
      )
    ) {
      throw new BadRequestException('Already in Attendance');
    }
    const status = this.getStatus(currentSchedule);

    const newAttendance = this.attendanceRepository.create({
      class: classObj,
      student: student,
      status: status,
      scheduleId: currentSchedule.id || '',
    });

    const savedAttendance = await this.attendanceRepository.save(newAttendance);

    if (student.push_token) {
      this.notificationsService.sendStudentNotif(student.push_token, {
        body: `Attendance successfully recorded for ${currentSchedule.subject.name}`,
        title: `Attendance for ${currentSchedule.subject.name}`,
        classId: classObj.id,
        user: 'student',
        attendanceId: savedAttendance.id,
      });
    }

    if (parent && parent.push_token) {
      this.notificationsService.sendParentNotif(parent.push_token, {
        body: `${student.first_name} attended today at ${timeToDisplay(`${now.getHours()}:${now.getMinutes()}`)} today for class ${currentSchedule.subject.name}`,
        title: `${student.first_name} attendance`,
        user: 'parent',
        classId: classObj.id,
        studentId: student.id,
        attendanceId: savedAttendance.id,
      });
    }

    return savedAttendance;
  }

  async findOne(attendanceId: string) {
    return this.attendanceRepository.findOne({
      where: { id: attendanceId },
      relations: ['student', 'class', 'class.class_teacher'],
    });
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

  async update(attendanceId: string, payload: Partial<Attendance>) {
    const { status } = payload;
    const existingAttendance = await this.attendanceRepository.findOne({
      where: { id: attendanceId },
      relations: ['student', 'class', 'class.schedules', 'student.parent'], // Specify the relations here
    });

    const parent = existingAttendance?.student.parent;
    const student = existingAttendance?.student;
    if (!existingAttendance) {
      // Handle the case where the attendance record doesn't exist
      throw new NotFoundException(
        `Attendance with ID ${attendanceId} not found`,
      );
    }

    await this.attendanceRepository.update(
      attendanceId, // Include the existing entity with relations
      payload, // Apply the updates from the payload
    );

    const currentSchedule = this.getCurrentSchedule(
      existingAttendance.class.schedules,
    );

    if (!currentSchedule) {
      throw new ForbiddenException('No Schedule within this time');
    }

    if (parent && parent.push_token) {
      this.notificationsService.sendParentNotif(parent.push_token, {
        body: `${student?.first_name} attendance updated to ${status}`,
        title: `${student?.first_name} attendance`,
        user: 'parent',
        classId: existingAttendance.class.id,
        studentId: student?.id || '',
        attendanceId: attendanceId,
      });
    }
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

  async getAttendanceByCurrentSched(class_id: string, schedule_id: string) {
    const classObj = await this.classService.findById(class_id, ['schedules']);

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
    const currentDate = new Date().getDate();
    const currentSchedAttendance = schedAllAttendance.filter((att) => {
      const attMonth = att.timestamp.getMonth();
      const attDate = att.timestamp.getDate();

      return attMonth === currentMonth && attDate === currentDate;
    });

    return currentSchedAttendance.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }

  async deleteAll() {
    return this.attendanceRepository.clear();
  }

  getCurrentSchedule(schedules: Schedule[]) {
    const now = new Date();
    const currentDay = now
      .toLocaleString('en-US', { weekday: 'long' })
      .toLowerCase();

    const today = now.toISOString().split('T')[0];

    console.log(now);
    console.log(today);

    return schedules.find((schedule) => {
      if (schedule.day_of_week.toLowerCase() !== currentDay) return false;

      const start = new Date(`${today}T${schedule.start_time}`);
      const end = new Date(`${today}T${schedule.end_time}`);

      console.log(start);
      console.log(end);

      return now >= start && now <= end;
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

    console.log('Now:', now);
    console.log('Diff:', diffMinutes);
    console.log('start:', start);
    console.log('end:', end);
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

  async isExistingAttendance(
    student_id: string,
    sched_id: string,
    class_id: string,
  ) {
    const currentSchedAttendance = await this.getAttendanceByCurrentSched(
      class_id,
      sched_id,
    );

    const existingAttendance = currentSchedAttendance.find((att) => {
      return att.student.id === student_id;
    });

    return existingAttendance ? true : false;
  }
}
