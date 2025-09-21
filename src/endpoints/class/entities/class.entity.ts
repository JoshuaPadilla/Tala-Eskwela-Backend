import { Attendance } from 'src/endpoints/attendance/entities/attendance.entity';
import { Schedule } from 'src/endpoints/schedule/entities/schedule.entity';
import { Student } from 'src/endpoints/users/students/entities/student.entity';
import { Teacher } from 'src/endpoints/users/teachers/entities/teacher.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  section: string;

  @Column({ type: 'int' })
  grade_lvl: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  // Relations

  @OneToOne(() => Teacher, (t) => t.advisory_class)
  @JoinColumn()
  class_teacher: Teacher;

  @OneToMany(() => Student, (student) => student.class)
  students: Student[];

  @OneToMany(() => Attendance, (attendance) => attendance.class)
  attendance_records: Attendance[];

  @OneToMany(() => Schedule, (schedule) => schedule.class, { cascade: true })
  schedules: Schedule[];
}
