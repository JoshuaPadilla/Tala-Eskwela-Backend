import { PartialType } from '@nestjs/mapped-types';
import { CreateClassDto } from 'src/endpoints/class/dto/create-class.dto';

export class UpdateScheduleDto extends PartialType(CreateClassDto) {}
