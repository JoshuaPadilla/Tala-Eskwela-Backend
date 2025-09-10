import { Schedule } from 'src/endpoints/schedule/entities/schedule.entity';
import { Teacher } from 'src/endpoints/users/teachers/entities/teacher.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  subject_id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  desc: string;

  // Relations
  @OneToMany(() => Schedule, (schedule) => schedule.subject)
  schedules: Schedule[];
}
