import { Course } from 'src/endpoints/courses/entities/course.entity';
import { Roles } from 'src/enums/role.enum';
import { Parent } from 'src/endpoints/users/parents/entities/parent.entity';
import { Teacher } from 'src/endpoints/users/teachers/entities/teacher.entity';
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
import { Class } from 'src/endpoints/class/entities/class.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
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

  @Column({ type: 'enum', enum: Roles, default: Roles.STUDENT })
  role: Roles;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  // Relations

  @ManyToMany(() => Class, (classes) => classes.students)
  @JoinTable()
  classes: Class[];

  @ManyToMany(() => Teacher, (teachers) => teachers.students)
  @JoinTable()
  teachers: Teacher[];

  @ManyToMany(() => Course, (courses) => courses.students)
  courses: Course[];

  @OneToMany(() => Parent, (parent) => parent.students)
  parent: Parent;
}
