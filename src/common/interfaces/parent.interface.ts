import { Roles } from 'src/enums/role.enum';

export interface ParentInterface {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  phone: string;
  password: string;
  role: Roles;
  createdAt?: Date;
  updatedAt?: Date;
}
