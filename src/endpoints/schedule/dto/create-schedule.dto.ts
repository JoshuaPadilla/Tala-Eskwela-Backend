import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { DAY_OF_WEEK } from 'src/enums/day_of_week';

// Define your enum here

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsEnum(DAY_OF_WEEK)
  day_of_week: DAY_OF_WEEK;

  @IsNotEmpty()
  @IsString()
  start_time: string;

  @IsNotEmpty()
  @IsString()
  end_time: string;

  @IsNotEmpty()
  @IsUUID()
  class_id: string;

  @IsNotEmpty()
  @IsUUID()
  subject_id: string;
}
