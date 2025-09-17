import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { Student } from '../users/students/entities/student.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { TeachersModule } from '../users/teachers/teachers.module';
import { StudentsModule } from '../users/students/students.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { Teacher } from '../users/teachers/entities/teacher.entity';

@Module({
  controllers: [ClassController],
  providers: [ClassService],
  imports: [
    TypeOrmModule.forFeature([Class, Student, Schedule, Teacher]),
    TeachersModule,
    StudentsModule,
    ScheduleModule,
  ],
})
export class ClassModule {}
