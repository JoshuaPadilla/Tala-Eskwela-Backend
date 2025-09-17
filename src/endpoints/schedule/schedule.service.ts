import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Class } from '../class/entities/class.entity';
import { Subject } from '../subject/entities/subject.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  async createSchedule(createScheduleDto: CreateScheduleDto) {
    const { class_id, subject_id, ...rest } = createScheduleDto;

    const classToAdd = await this.classRepository.findOne({
      where: { id: class_id },
    });

    const subjectToAdd = await this.subjectRepository.findOne({
      where: { id: subject_id },
    });

    if (!classToAdd || !subjectToAdd) {
      throw new NotFoundException();
    }

    return await this.scheduleRepository.save({
      class: classToAdd,
      subject: subjectToAdd,
      ...rest,
    });
  }
}
