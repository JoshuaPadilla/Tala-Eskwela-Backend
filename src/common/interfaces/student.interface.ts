import { Roles } from 'src/enums/role.enum';

export interface StudentInterface {
  id: string;
  rfid_tag_uid: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  password: string;
  phone: string;
  grade_lvl: string;
  class_id: string;
  role: Roles;
  guardian_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
