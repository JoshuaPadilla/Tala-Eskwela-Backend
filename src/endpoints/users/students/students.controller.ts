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
  Query,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { UpdateStudentDto } from './dto/update-student.dto';
import { User_Roles } from 'src/decorators/roles.decorator';
import { Roles } from 'src/enums/role.enum';
import { RolesGuard } from 'src/guards/role.guard';
import { Student } from './entities/student.entity';

// @User_Roles(Roles.TEACHER)
// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Query() query: Partial<Omit<Student, 'password'>>) {
    return this.studentsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findById(id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('setStudentToRegister')
  setStudentToRegister(@Body() body: { id: string }) {
    return this.studentsService.setStudentToRegister(body.id);
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
