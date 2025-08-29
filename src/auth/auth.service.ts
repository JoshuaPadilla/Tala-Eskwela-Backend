// src/auth/auth.service.ts
import {
  Injectable,
  BadRequestException,
  NotImplementedException,
  UnauthorizedException,
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
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { comparePasswords } from 'src/common/helpers/passwordHelpers';
import { TeacherInterface } from 'src/common/interfaces/teacher.interface';
import { StudentInterface } from 'src/common/interfaces/student.interface';
import { compare } from 'bcrypt';
import { ParentInterface } from 'src/common/interfaces/parent.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly parentService: ParentsService,
    private readonly teacherService: TeachersService,
    private readonly studentService: StudentsService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { password, ...user } = loginDto;

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    return {
      user: user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registrationDto: RegistrationDto): Promise<any> {
    const { role, registrationForm } = registrationDto;

    let dtoClass;
    let service;
    let newUser;

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

    // check for user existence
    const userExist = await service.findByEmail(
      registrationDto.registrationForm.email,
    );

    if (userExist) {
      throw new BadRequestException('This email already exist');
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
      newUser = await service.registerParent(specificDto as RegisterParentDto);
    } else if (role === Roles.STUDENT) {
      newUser = await service.registerStudent(
        specificDto as RegisterStudentDto,
      );
    } else if (role === Roles.TEACHER) {
      newUser = await service.registerTeacher(
        specificDto as RegisterTeacherDto,
      );
    }

    return this.login(newUser);
  }

  async validateUser(email: string, password: string) {
    const teacher = await this.teacherService.findByEmail(email);
    if (teacher && (await comparePasswords(password, teacher.password))) {
      return teacher;
    }

    const student = await this.studentService.findByEmail(email);
    if (student && (await comparePasswords(password, student.password))) {
      return student;
    }

    const parent = await this.parentService.findByEmail(email);
    if (student && (await comparePasswords(password, student.password))) {
      return parent;
    }

    return null;
  }
}
