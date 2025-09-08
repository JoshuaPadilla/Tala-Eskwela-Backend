import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
} from 'class-validator';
import { Roles } from 'src/enums/role.enum';

export class LoginDto {
  @IsString()
  email: string;

  @IsString()
  id: string;

  @IsString()
  role: Roles;

  @IsString()
  password: string;

  @IsString()
  push_token: string;
}
