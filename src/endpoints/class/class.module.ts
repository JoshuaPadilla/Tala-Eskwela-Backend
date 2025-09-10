import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { Student } from '../users/students/entities/student.entity';
import { Schedule } from '../schedule/entities/schedule.entity';

@Module({
  controllers: [ClassController],
  providers: [ClassService],
  imports: [TypeOrmModule.forFeature([Class, Student, Schedule])],
})
export class ClassModule {}
