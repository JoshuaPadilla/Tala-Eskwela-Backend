import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  student_id: string;

  @IsString()
  password: string;
}
