import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  async findAll() {
    return await this.teachersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('check')
  checkAuth(@Request() req) {
    return req.user;
  }
}
