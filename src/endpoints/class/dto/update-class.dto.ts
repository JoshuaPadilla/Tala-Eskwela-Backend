import { PartialType } from '@nestjs/mapped-types';
import { CreateClassDto } from './create-class.dto';
import { IsArray, IsOptional } from 'class-validator';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

export class UpdateClassDto extends PartialType(CreateClassDto) {
  @IsOptional()
  @IsArray()
  students: string[];

  @IsOptional()
  @IsArray()
  schedules: string[];
}
