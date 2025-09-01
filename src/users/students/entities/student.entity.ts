import { Course } from 'src/courses/entities/course.entity';
import { Roles } from 'src/enums/role.enum';
import { Parent } from 'src/users/parents/entities/parent.entity';
import { Teacher } from 'src/users/teachers/entities/teacher.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rfid_tag_uid: string;

  @Column({ type: 'text' })
  first_name: string;

  @Column({ type: 'text' })
  last_name: string;

  @Column({ type: 'text' })
  middle_name: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text' })
  phone: string;

  @Column({ type: 'text' })
  grade_lvl: string;

  @Column({ type: 'text' })
  class_id: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.STUDENT })
  role: Roles;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  // Relations

  @ManyToMany(() => Teacher, (teachers) => teachers.students)
  @JoinTable()
  teachers: Teacher[];

  @ManyToMany(() => Course, (courses) => courses.students)
  @JoinTable()
  courses: Course[];

  @OneToMany(() => Parent, (parent) => parent.students)
  parent: Parent;
}
