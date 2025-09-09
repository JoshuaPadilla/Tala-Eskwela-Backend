import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Parent } from 'src/endpoints/users/parents/entities/parent.entity';
import { Teacher } from 'src/endpoints/users/teachers/entities/teacher.entity';

export class RegisterStudentDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  rfid_tag_uid: string;

  @IsString()
  @IsOptional()
  push_token: string;

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

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsArray()
  teachers: Teacher[];
}
