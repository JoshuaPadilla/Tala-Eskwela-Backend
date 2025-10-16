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

  updateProfile(role: Roles, userId: string, profileUrl: string) {
    switch (role) {
      case Roles.PARENT:
        return this.parentService.updateParent(userId, { profileUrl });
      case Roles.TEACHER:
        return this.teacherService.updateTeacher(userId, { profileUrl });
      case Roles.STUDENT:
        return this.studentService.updateStudent(userId, { profileUrl });
    }
  }
}
