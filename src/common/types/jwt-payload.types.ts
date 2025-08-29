import { Roles } from 'src/enums/role.enum';

export type JwtPayload = {
  sub: string;
  email: string;
  role: Roles;
};
