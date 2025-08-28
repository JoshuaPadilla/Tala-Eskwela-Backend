import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ParentsService } from 'src/users/parents/parents.service';
import { StudentsService } from 'src/users/students/students.service';
import { TeachersService } from 'src/users/teachers/teachers.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ParentsService, StudentsService, TeachersService],
})
export class AuthModule {}
