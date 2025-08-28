import { SetMetadata } from '@nestjs/common';
import { Roles } from '../enums/role.enum';

export const ROLES_KEY = 'roles';
export const User_Roles = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);
