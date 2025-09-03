import { PartialType } from '@nestjs/mapped-types';
import { RegisterStudentDto } from 'src/common/dto/register-student.dto';

export class UpdateStudentDto extends PartialType(RegisterStudentDto) {}
