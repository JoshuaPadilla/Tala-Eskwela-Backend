import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async createCourse(dto: CreateCourseDto): Promise<Course | null> {
    const newCourse = await this.courseRepository.create(dto);

    const newlySavedCourse = await this.courseRepository.save(newCourse);

    const courseWithRelations = await this.courseRepository.findOne({
      where: { id: newlySavedCourse.id },
      relations: ['students', 'teachers'],
    });

    return courseWithRelations;
  }

  async findAllCourses(): Promise<Course[] | []> {
    return await this.courseRepository.find();
  }
}
