import { Student } from 'src/users/students/entities/student.entity';
import { Teacher } from 'src/users/teachers/entities/teacher.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
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

  @ManyToMany(() => Teacher, (teachers) => teachers.courses)
  @JoinTable()
  teachers: Teacher[];

  @ManyToMany(() => Student, (students) => students.courses, {
    cascade: true,
  })
  @JoinTable()
  students: Student[];
}
