import { Exclude } from 'class-transformer';
import { Course } from 'src/endpoints/courses/entities/course.entity';
import { Roles } from 'src/enums/role.enum';
import { Student } from 'src/endpoints/users/students/entities/student.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Class } from 'src/endpoints/class/entities/class.entity';

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  push_token: string;

  @Column({ type: 'text' })
  first_name: string;

  @Column({ type: 'text' })
  last_name: string;

  @Column({ type: 'text' })
  middle_name: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  @Exclude()
  password: string;

  @Column({ type: 'text' })
  phone: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.TEACHER })
  role: Roles;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  //relations

  @ManyToMany(() => Course, (course) => course.teachers, {
    cascade: true,
  })
  @JoinTable()
  teached_courses: Course[];

  //
  @ManyToMany(() => Student, (students) => students.teachers, {
    cascade: true,
  })
  @JoinTable()
  students: Student[];
}
