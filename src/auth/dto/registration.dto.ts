import { IsNotEmptyObject, IsObject, IsString } from 'class-validator';
import { ParentInterface } from 'src/common/interfaces/parent.interface';
import { StudentInterface } from 'src/common/interfaces/student.interface';
import { TeacherInterface } from 'src/common/interfaces/teacher.interface';
import { Roles } from 'src/enums/role.enum';

export class RegistrationDto {
  @IsString()
  role: Roles;

  @IsNotEmptyObject()
  @IsObject()
  registrationForm: any;
}
