import { Roles } from 'src/enums/role.enum';

export interface TeacherInterface {
  teacher_id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  password: string;
  phone: string;
  role: Roles;
  createdAt?: Date;
  updatedAt?: Date;
}
