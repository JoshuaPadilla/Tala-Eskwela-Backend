import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.teachersService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateTeacher(@Param('id') id: string, @Body() updateForm: UpdateTeacherDto) {
    return this.teachersService.updateTeacher(id, updateForm);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteTeacher(@Param('id') id: string) {
    return this.teachersService.deleteTeacher(id);
  }
}
