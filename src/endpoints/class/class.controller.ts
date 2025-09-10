import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  createClass(@Body() CreateClassDto: CreateClassDto) {
    return this.classService.createClass(CreateClassDto);
  }

  @Get()
  findAll() {
    return this.classService.findAll();
  }

  @Get(':class_id')
  findOne(@Param('class_id') class_id: string) {
    return this.classService.findOne(class_id);
  }

  @Patch(':class_id')
  updateClass(
    @Param('class_id') class_id: string,
    @Body() updateForm: UpdateClassDto,
  ) {
    return this.classService.updateClass(class_id, updateForm);
  }
}
