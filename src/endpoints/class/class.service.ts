import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Student } from '../users/students/entities/student.entity';
import { Schedule } from '../schedule/entities/schedule.entity';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async createClass(createClassDto: CreateClassDto) {
    const newClass = await this.classRepository.save(createClassDto);
    return await this.classRepository.findOne({
      where: { class_id: newClass.class_id },
      relations: ['students', 'attendance_records', 'schedules'],
    });
  }

  async findAll() {
    return await this.classRepository.find();
  }

  async findOne(class_id: string) {
    return await this.classRepository.findOne({
      where: { class_id: class_id },
      relations: ['students', 'attendance_records', 'schedules'],
    });
  }

  async updateClass(class_id: string, updateForm: UpdateClassDto) {
    const { students, schedules, ...rest } = updateForm;

    const classToUpdate = await this.classRepository.findOne({
      where: { class_id },
      relations: ['students', 'schedules'], // Eagerly load the current students
    });

    if (!classToUpdate) {
      throw new NotFoundException('Class not found'); // Class not found
    }

    let newStudentEntities: Student[] = [];
    let newScheduleEntities: Schedule[] = [];

    if (students && students.length > 0) {
      newStudentEntities = await this.studentRepository.find({
        where: { id: In(students) },
      });
    }

    if (schedules && schedules.length > 0) {
      newScheduleEntities = await this.scheduleRepository.find({
        where: { schedule_id: In(schedules) },
      });
    }

    const allStudent = new Set([
      ...(classToUpdate.students || []),
      ...newStudentEntities,
    ]);
    const allSchedules = new Set([
      ...(classToUpdate.schedules || []),
      ...(newScheduleEntities || []),
    ]);

    const updateClass = await this.classRepository.preload({
      class_id,
      ...rest,
      students: [...allStudent],
      schedules: [...allSchedules],
    });

    return updateClass;
  }
}
