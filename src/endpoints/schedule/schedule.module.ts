import { forwardRef, Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Class } from '../class/entities/class.entity';
import { Subject } from '../subject/entities/subject.entity';
import { ClassModule } from '../class/class.module';
import { SubjectModule } from '../subject/subject.module';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  imports: [
    TypeOrmModule.forFeature([Schedule, Subject, Class]),
    forwardRef(() => ClassModule),
    forwardRef(() => SubjectModule),
  ],
  exports: [ScheduleService],
})
export class ScheduleModule {}
