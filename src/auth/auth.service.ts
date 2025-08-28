// src/auth/auth.service.ts
import {
  Injectable,
  BadRequestException,
  NotImplementedException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { Roles } from 'src/enums/role.enum';
import { ParentsService } from 'src/users/parents/parents.service';
import { TeachersService } from 'src/users/teachers/teachers.service';
import { StudentsService } from 'src/users/students/students.service';
import { RegistrationDto } from './dto/registration.dto';
import { RegisterParentDto } from 'src/common/dto/register-parent.dto';
import { RegisterStudentDto } from 'src/common/dto/register-student.dto'; // Assuming you have these DTOs
import { RegisterTeacherDto } from 'src/common/dto/register-teacher.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly parentService: ParentsService,
    private readonly teacherService: TeachersService,
    private readonly studentService: StudentsService,
  ) {}

  async login() {
    throw new NotImplementedException(
      'Login functionality not implemented yet',
    );
  }

  async register(registrationDto: RegistrationDto) {
    const { role, registrationForm } = registrationDto;

    let dtoClass;
    let service;

    switch (role) {
      case Roles.PARENT:
        dtoClass = RegisterParentDto;
        service = this.parentService;
        break;
      case Roles.STUDENT:
        dtoClass = RegisterStudentDto;
        service = this.studentService;
        break;
      case Roles.TEACHER:
        dtoClass = RegisterTeacherDto;
        service = this.teacherService;
        break;
      default:
        throw new BadRequestException('Invalid role provided');
    }

    // 1. Create a new instance of the specific DTO
    const specificDto = Object.assign(new dtoClass(), registrationForm);

    // 2. Manually validate the specific DTO
    const errors = await validate(specificDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // 3. Call the specific service with the now-validated DTO
    if (role === Roles.PARENT) {
      await service.registerParent(specificDto);
    } else if (role === Roles.STUDENT) {
      await service.registerStudent(specificDto);
    } else if (role === Roles.TEACHER) {
      await service.registerTeacher(specificDto);
    }
  }
}
