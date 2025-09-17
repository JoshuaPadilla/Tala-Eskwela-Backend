import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Student } from '../users/students/entities/student.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Teacher } from '../users/teachers/entities/teacher.entity';
import { TeachersService } from '../users/teachers/teachers.service';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private readonly teacherService: TeachersService,
  ) {}

  async createClass(createClassDto: CreateClassDto) {
    const { class_teacher, ...form } = createClassDto;

    const teacher = await this.teacherService.findById(class_teacher);

    if (!teacher) {
      throw new NotFoundException('No teacher found on creating class');
    }

    const newClass = await this.classRepository.save({
      ...form,
      class_teacher: teacher,
    });
    return await this.classRepository.findOne({
      where: { id: newClass.id },
      relations: ['students', 'attendance_records', 'schedules'],
    });
  }

  async findAll() {
    return await this.classRepository.find();
  }

  async findOne(class_id: string) {
    return await this.classRepository.findOne({
      where: { id: class_id },
      relations: ['students', 'attendance_records', 'schedules'],
    });
  }

  async updateClass(class_id: string, updateForm: UpdateClassDto) {
    const { students, schedules, class_teacher, ...rest } = updateForm;

    const classToUpdate = await this.classRepository.findOne({
      where: { id: class_id },
      relations: ['students', 'schedules'], // Eagerly load the current students
    });

    if (!classToUpdate) {
      throw new NotFoundException('Class not found'); // Class not found
    }

    let newStudentEntities: Student[] = [];
    let newScheduleEntities: Schedule[] = [];
    let teacherEntity: Teacher | null = null;

    if (students && students.length > 0) {
      newStudentEntities = await this.studentRepository.find({
        where: { id: In(students) },
      });
    }

    if (schedules && schedules.length > 0) {
      newScheduleEntities = await this.scheduleRepository.find({
        where: { id: In(schedules) },
      });
    }

    if (class_teacher) {
      teacherEntity = await this.teacherService.findById(class_teacher);
      if (!teacherEntity) {
        throw new NotFoundException('Teacher not found for update');
      }
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
      id: class_id,
      ...rest,
      students: [...allStudent],
      schedules: [...allSchedules],
      ...(teacherEntity ? { class_teacher: teacherEntity } : {}),
    });

    return updateClass;
  }
}
