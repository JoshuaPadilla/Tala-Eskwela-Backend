import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { RegisterTeacherDto } from 'src/common/dto/register-teacher.dto';

export class UpdateTeacherDto extends PartialType(RegisterTeacherDto) {}
