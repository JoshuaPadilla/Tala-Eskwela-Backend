import { ParentInterface } from 'src/common/interfaces/parent.interface';
import { StudentInterface } from 'src/common/interfaces/student.interface';
import { TeacherInterface } from 'src/common/interfaces/teacher.interface';
import { Roles } from 'src/enums/role.enum';

export interface RegistraterFormInterface {
  role: Roles;
  registrationForm: ParentInterface | StudentInterface | TeacherInterface;
}
