import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';

// @UseGuards(JwtAuthGuard)
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}
  @Get()
  findAll(@Query() query: Partial<Omit<Teacher, 'password'>>) {
    return this.teachersService.findAll(query);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachersService.findById(id);
  }

  @Patch(':id')
  updateTeacher(@Param('id') id: string, @Body() updateForm: UpdateTeacherDto) {
    return this.teachersService.updateTeacher(id, updateForm);
  }

  @Delete(':id')
  deleteTeacher(@Param('id') id: string) {
    return this.teachersService.deleteTeacher(id);
  }
}
