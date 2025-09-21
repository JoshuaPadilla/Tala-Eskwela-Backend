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
import { ScheduleService } from '../schedule/schedule.service';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private readonly scheduleService: ScheduleService,
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

    await this.teacherService.addClass(class_teacher, newClass);

    return await this.classRepository.findOne({
      where: { id: newClass.id },
      relations: [
        'students',
        'attendance_records',
        'schedules',
        'class_teacher',
      ],
    });
  }

  async findAll() {
    return await this.classRepository.find({
      relations: [
        'students',
        'attendance_records',
        'schedules',
        'class_teacher',
      ],
    });
  }

  async findOne(class_id: string) {
    return await this.classRepository.findOne({
      where: { id: class_id },
      relations: [
        'students',
        'attendance_records',
        'schedules',
        'class_teacher',
      ],
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
      newScheduleEntities = await this.scheduleService.findMany(schedules);
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

  async deleteClass(class_id: string) {
    await this.classRepository.delete(class_id);
  }

  async addStudents(class_id: string, students: Student[]) {
    const classObj = await this.classRepository.findOne({
      where: { id: class_id },
    });
  }

  async addSchedule(class_id: string, schedule: Schedule) {
    const classObj = await this.classRepository.findOne({
      where: { id: class_id },
    });

    if (!classObj) {
      throw new NotFoundException('Cannot find class');
    }

    classObj.schedules = [...classObj.schedules, schedule];

    await this.classRepository.save(classObj);
  }

  async findById(class_id: string) {
    return await this.classRepository.findOne({ where: { id: class_id } });
  }
}
