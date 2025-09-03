import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { UpdateStudentDto } from './dto/update-student.dto';

@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findById(id);
  }

  @Patch(':id')
  updateStudent(@Param('id') id: string, @Body() updateForm: UpdateStudentDto) {
    return this.studentsService.updateStudent(id, updateForm);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteStudent(@Param('id') id: string) {
    this.studentsService.deleteStudent(id);
  }
}
