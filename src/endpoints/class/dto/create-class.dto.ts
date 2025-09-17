import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  isString,
  IsString,
} from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty()
  @IsString()
  section: string;

  @IsNotEmpty()
  @IsNumber()
  grade_lvl: number;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  class_teacher: string;
}
