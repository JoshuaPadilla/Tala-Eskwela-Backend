import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { Subject } from './entities/subject.entity';
import { UpdateSubjectDto } from './dto/update-schedule.dto';
import { Schedule } from '../schedule/entities/schedule.entity';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  async createSubject(createSubjectDto: CreateSubjectDto) {
    return await this.subjectRepository.save(createSubjectDto);
  }

  async findAll() {
    return await this.subjectRepository.find();
  }

  async findOne(subject_id: string) {
    return await this.subjectRepository.findOne({
      where: { id: subject_id },
    });
  }

  async updateSubject(subject_id: string, updateSubjectDto: UpdateSubjectDto) {
    return await this.subjectRepository.preload({
      id: subject_id,
      ...updateSubjectDto,
    });
  }

  async deleteSubject(subject_id) {
    await this.subjectRepository.delete(subject_id);
  }

  async addSchedules(subject_id: string, schedules: Schedule[]) {
    const subject = await this.subjectRepository.findOne({
      where: { id: subject_id },
      relations: ['schedules'],
    });

    if (!subject) {
      throw new NotFoundException('Cannot find Subject');
    }

    subject.schedules = [...subject.schedules, ...schedules];

    await this.subjectRepository.save(subject);
  }
}
