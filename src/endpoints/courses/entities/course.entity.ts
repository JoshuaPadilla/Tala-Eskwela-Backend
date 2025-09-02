import { Student } from 'src/endpoints/users/students/entities/student.entity';
import { Teacher } from 'src/endpoints/users/teachers/entities/teacher.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  desc?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  //   Relation

  @ManyToOne(() => Teacher, { nullable: true })
  @JoinColumn()
  assigned_teacher: Teacher;

  @ManyToMany(() => Teacher, (teachers) => teachers.teached_courses)
  @JoinTable()
  teachers: Teacher[];

  @ManyToMany(() => Student, (students) => students.courses, {
    cascade: true,
  })
  @JoinTable()
  students: Student[];
}
