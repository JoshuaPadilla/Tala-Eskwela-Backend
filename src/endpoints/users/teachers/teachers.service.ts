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

  async findAll(): Promise<TeacherInterface[]> {
    return this.teacherRepository.find({
      relations: ['teached_courses', 'students'],
    });
  }

  async findByEmail(email: string) {
    const teacher = await this.teacherRepository.findOne({
      where: { email: email },
      // relations: ['teached_courses', 'students'],
    });

    return teacher;
  }

  async findById(id: string) {
    const teacher = await this.teacherRepository.findOne({
      where: { id },
      relations: ['teached_courses', 'students'],
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

    return this.teacherRepository.save(teacherToUpdate);
  }

  async deleteTeacher(id: string) {
    const teacher = await this.teacherRepository.findOne({ where: { id } });
    if (!teacher) {
      throw new BadRequestException('Teacher not found');
    }
    await this.teacherRepository.remove(teacher);
  }
}
