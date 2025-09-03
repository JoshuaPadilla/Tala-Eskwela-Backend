import { PartialType } from '@nestjs/mapped-types';
import { RegisterParentDto } from 'src/common/dto/register-parent.dto';

export class UpdateParentDto extends PartialType(RegisterParentDto) {}
