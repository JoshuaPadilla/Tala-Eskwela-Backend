import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Course } from 'src/endpoints/courses/entities/course.entity';
import { Parent } from 'src/endpoints/users/parents/entities/parent.entity';
import { Teacher } from 'src/endpoints/users/teachers/entities/teacher.entity';

export class RegisterStudentDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  rfid_tag_uid: string;

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
  grade_lvl: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsArray()
  courses: Course[];

  @IsOptional()
  @IsArray()
  teachers: Teacher[];
}
