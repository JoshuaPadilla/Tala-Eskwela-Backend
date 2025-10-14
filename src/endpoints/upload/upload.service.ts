import { Injectable } from '@nestjs/common';
import { TeachersService } from '../users/teachers/teachers.service';
import { StudentsService } from '../users/students/students.service';
import { ParentsService } from '../users/parents/parents.service';
import { JwtPayload } from 'src/common/types/jwt-payload.types';
import { Roles } from 'src/enums/role.enum';

@Injectable()
export class UploadService {
  constructor(
    private readonly teacherService: TeachersService,
    private readonly studentService: StudentsService,
    private readonly parentService: ParentsService,
  ) {}

  updateProfile(user: any, profileUrl: string) {
    switch (user.role) {
      case user.role === Roles.PARENT:
        return this.parentService.updateParent(user.userId, { profileUrl });
      case user.role === Roles.TEACHER:
        return this.teacherService.updateTeacher(user.userId, { profileUrl });
      case user.role === Roles.STUDENT:
        return this.studentService.updateStudent(user.userId, { profileUrl });
    }
  }
}
