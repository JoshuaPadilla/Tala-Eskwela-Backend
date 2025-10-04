import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ClassService } from '../class/class.service';
import { SubjectService } from '../subject/subject.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @Inject(forwardRef(() => ClassService))
    private readonly classService: ClassService,
    @Inject(forwardRef(() => SubjectService))
    private readonly subjectService: SubjectService,
  ) {}

  async createSchedule(createScheduleDto: CreateScheduleDto) {
    const { class_id, subject_id, ...rest } = createScheduleDto;

    const classToAdd = await this.classService.findById(class_id);

    const subjectToAdd = await this.subjectService.findOne(subject_id);

    if (!subjectToAdd) {
      throw new NotFoundException('Cannot find subject');
    }

    if (!classToAdd) {
      throw new NotFoundException('Cannot find class');
    }

    const savedSchedule = await this.scheduleRepository.save({
      class: classToAdd,
      subject: subjectToAdd,
      ...rest,
    });

    await this.classService.addSchedule(classToAdd.id, savedSchedule);
    await this.subjectService.addSchedules(subjectToAdd.id, [savedSchedule]);

    return this.scheduleRepository.findOne({
      where: { id: savedSchedule.id },
      relations: ['class', 'class.class_teacher', 'subject'],
    });
  }

  async findAll() {
    return await this.scheduleRepository.find({
      relations: ['class', 'class.class_teacher', 'subject'],
    });
  }

  async deleteSchedule(schedule_id: string) {
    await this.scheduleRepository.delete(schedule_id);
  }

  async findById(schedule_id: string) {
    return await this.scheduleRepository.findOne({
      where: { id: schedule_id },
    });
  }

  async findMany(schedule_ids: string[]) {
    return await this.scheduleRepository.find({
      where: { id: In(schedule_ids) },
    });
  }

  async getTodaysSchedules(class_id: string) {
    const classObj = await this.classService.findOne(class_id);

    if (!classObj) {
      throw new NotFoundException('cannot find class');
    }

    const currentDay = new Date()
      .toLocaleString('en-US', { weekday: 'long' })
      .toLowerCase();

    const todaysSchedules = classObj.schedules.filter((schedule) => {
      return schedule;
    });

    return todaysSchedules;
  }
}
