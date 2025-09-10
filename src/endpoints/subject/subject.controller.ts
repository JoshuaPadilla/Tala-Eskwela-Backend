import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-schedule.dto';

@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.createSubject(createSubjectDto);
  }

  @Get()
  findAll() {
    return this.subjectService.findAll();
  }

  @Get(':subject_id')
  findOne(@Param('subject_id') subject_id: string) {
    return this.subjectService.findOne(subject_id);
  }

  @Patch(':subject_id')
  updateSubject(
    @Param('subject_id') subject_id,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectService.updateSubject(subject_id, updateSubjectDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':subject_id')
  deleteSubject(@Param('subject_id') subject_id) {
    return this.subjectService.deleteSubject(subject_id);
  }
}
