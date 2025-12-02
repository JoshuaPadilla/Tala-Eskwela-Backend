// src/auth/auth.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { Roles } from 'src/enums/role.enum';
import { ParentsService } from 'src/endpoints/users/parents/parents.service';
import { TeachersService } from 'src/endpoints/users/teachers/teachers.service';
import { StudentsService } from 'src/endpoints/users/students/students.service';
import { RegistrationDto } from './dto/registration.dto';
import { RegisterParentDto } from 'src/common/dto/register-parent.dto';
import { RegisterStudentDto } from 'src/common/dto/register-student.dto'; // Assuming you have these DTOs
import { RegisterTeacherDto } from 'src/common/dto/register-teacher.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { comparePasswords } from 'src/common/helpers/passwordHelpers';
import { AdminService } from 'src/endpoints/admin/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly parentService: ParentsService,
    private readonly teacherService: TeachersService,
    private readonly studentService: StudentsService,
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService,
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

  async validateUser(email: string, password: string, push_token: string) {
    const teacher = await this.teacherService.findByEmail(email);
    if (teacher && (await comparePasswords(password, teacher.password))) {
      return await this.teacherService.updateTeacher(teacher.id, {
        push_token,
      });
    }

    const student = await this.studentService.findByEmail(email);
    if (student && (await comparePasswords(password, student.password))) {
      return await this.studentService.updateStudent(student.id, {
        push_token,
      });
    }

    const parent = await this.parentService.findByEmail(email);
    if (parent && (await comparePasswords(password, parent.password))) {
      return await this.parentService.updateParent(parent.id, { push_token });
    }

    const admin = await this.adminService.findByEmail(email);
    if (admin && (await comparePasswords(password, admin.password))) {
      return admin;
    }

    return null;
  }

  async checkAuth(user: any) {
    switch (user.role) {
      case Roles.PARENT:
        const { password: parentPassword, ...parent } =
          await this.parentService.findById(user.userId);
        return parent;
      case Roles.STUDENT:
        const { password: studentPassword, ...student } =
          await this.studentService.findById(user.userId);
        return student;
      case Roles.TEACHER:
        const { password: teacherPassword, ...teacher } =
          await this.teacherService.findById(user.userId, [
            'advisory_class',
            'advisory_class.students',
          ]);
        return teacher;
      case Roles.ADMIN:
        const { password: adminPassword, ...admin } =
          await this.adminService.findById(user.userId);
        return admin;

      default:
        throw new NotFoundException();
    }
  }
}
