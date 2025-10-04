import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';
import { RegisterTeacherDto } from 'src/common/dto/register-teacher.dto';
import { TeacherInterface } from 'src/common/interfaces/teacher.interface';
import { hashPassword } from 'src/common/helpers/passwordHelpers';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { NotFoundError } from 'rxjs';
import { Class } from 'src/endpoints/class/entities/class.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
  ) {}

  async registerTeacher(
    registerTeacherDto: RegisterTeacherDto,
  ): Promise<TeacherInterface> {
    const hashedPassword = await hashPassword(registerTeacherDto.password);

    const newTeacher = await this.teacherRepository.save({
      ...registerTeacherDto,
      password: hashedPassword,
    });

    return newTeacher;
  }

  async findAll(query: Partial<Omit<Teacher, 'password'>>) {
    const qb = this.teacherRepository
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.advisory_class', 'advisory_class');

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'advisory_class' && value === 'null') {
          // special case → advisory_class is NULL
          qb.andWhere('teacher.advisory_class IS NULL');
        } else {
          qb.andWhere(`teacher.${key} = :${key}`, { [key]: value });
        }
      }
    });

    return qb.getMany();
  }

  async findByEmail(email: string) {
    const teacher = await this.teacherRepository.findOne({
      where: { email: email },
      relations: ['advisory_class'],
      // relations: ['teached_courses', 'students'],
    });

    return teacher;
  }

  async findById(id: string, relations?: string[]) {
    const teacher = await this.teacherRepository.findOne({
      where: { id },
      relations: [
        'advisory_class',
        'advisory_class.students',
        'advisory_class.schedules',
        'advisory_class.attendance_records',
      ],
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return teacher;
  }

  async updateTeacher(id: string, updateForm: UpdateTeacherDto) {
    const teacherToUpdate = await this.teacherRepository.preload({
      id,
      ...updateForm,
    });

    if (!teacherToUpdate) {
      throw new BadRequestException('Teacher not found');
    }

    await this.teacherRepository.save(teacherToUpdate);

    return this.teacherRepository.findOne({
      where: { id: id },
      relations: ['advisory_class'],
    });
  }

  async deleteTeacher(id: string) {
    const teacher = await this.teacherRepository.findOne({ where: { id } });
    if (!teacher) {
      throw new BadRequestException('Teacher not found');
    }
    await this.teacherRepository.remove(teacher);
  }

  async addClass(id: string, classObj: Class) {
    const teacher = await this.teacherRepository.findOne({ where: { id } });

    if (!teacher) {
      return new NotFoundException('No teacher found');
    }

    teacher.advisory_class = classObj;

    await this.teacherRepository.save(teacher);
  }
}
