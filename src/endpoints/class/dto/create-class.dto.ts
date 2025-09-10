import { IsNumber, isString, IsString } from 'class-validator';

export class CreateClassDto {
  @IsString()
  section: string;

  @IsNumber()
  grade_lvl: number;
}
