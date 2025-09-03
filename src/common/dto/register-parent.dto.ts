import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Student } from 'src/endpoints/users/students/entities/student.entity';

export class RegisterParentDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  middle_name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsArray()
  students: Student[];

  @IsString()
  @IsNotEmpty()
  password: string;
}
