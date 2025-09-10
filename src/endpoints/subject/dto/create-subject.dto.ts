import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Schedule } from 'src/endpoints/schedule/entities/schedule.entity';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  desc: string;
}
