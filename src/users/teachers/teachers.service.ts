import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';
import { RegisterTeacherDto } from 'src/common/dto/register-teacher.dto';
import { TeacherInterface } from 'src/common/interfaces/teacher.interface';
import { hashPassword } from 'src/common/helpers/passwordHelpers';

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

  async findByEmail(email: string) {
    const teacher = await this.teacherRepository.findOne({
      where: { email: email },
    });

    return teacher;
  }

  async findAll(): Promise<TeacherInterface[]> {
    return this.teacherRepository.find();
  }
}
