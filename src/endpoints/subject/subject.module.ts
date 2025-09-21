import { forwardRef, Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { ScheduleModule } from '../schedule/schedule.module';

@Module({
  controllers: [SubjectController],
  providers: [SubjectService],
  imports: [
    TypeOrmModule.forFeature([Subject]),
    forwardRef(() => ScheduleModule),
  ],
  exports: [SubjectService],
})
export class SubjectModule {}
