import { Class } from 'src/endpoints/class/entities/class.entity';
import { Subject } from 'src/endpoints/subject/entities/subject.entity';
import { DAY_OF_WEEK } from 'src/enums/day_of_week';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: DAY_OF_WEEK })
  day_of_week: DAY_OF_WEEK;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;

  // Relations
  // Relations
  @ManyToOne(() => Class, (c) => c.schedules, { onDelete: 'CASCADE' })
  @JoinColumn() // FK column will be class_id
  class: Class;

  @ManyToOne(() => Subject, (s) => s.schedules, { onDelete: 'CASCADE' })
  @JoinColumn() // FK column will be class_id
  subject: Subject;
}
