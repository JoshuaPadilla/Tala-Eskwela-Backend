import { IsNotEmptyObject, IsObject, IsString } from 'class-validator';

import { Roles } from 'src/enums/role.enum';

export class RegistrationDto {
  @IsString()
  role: Roles;

  @IsNotEmptyObject()
  @IsObject()
  registrationForm: any;
}
