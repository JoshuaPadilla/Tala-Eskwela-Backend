import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { Subject } from './entities/subject.entity';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { UpdateSubjectDto } from './dto/update-schedule.dto';

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
      where: { subject_id: subject_id },
    });
  }

  async updateSubject(subject_id: string, updateSubjectDto: UpdateSubjectDto) {
    return await this.subjectRepository.preload({
      subject_id,
      ...updateSubjectDto,
    });
  }

  async deleteSubject(subject_id) {
    await this.subjectRepository.delete(subject_id);
  }
}
