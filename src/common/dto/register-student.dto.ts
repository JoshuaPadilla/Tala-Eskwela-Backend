import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  class_id: string;
}
