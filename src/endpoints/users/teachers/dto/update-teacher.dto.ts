import { PartialType } from '@nestjs/mapped-types';
import { RegisterTeacherDto } from 'src/common/dto/register-teacher.dto';

export class UpdateTeacherDto extends PartialType(RegisterTeacherDto) {}
