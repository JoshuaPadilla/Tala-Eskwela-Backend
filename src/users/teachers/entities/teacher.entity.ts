import { Exclude } from 'class-transformer';
import { Course } from 'src/courses/entities/course.entity';
import { Roles } from 'src/enums/role.enum';
import { Student } from 'src/users/students/entities/student.entity';
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
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  first_name: string;

  @Column({ type: 'text' })
  last_name: string;

  @Column({ type: 'text' })
  middle_name: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text' })
  @Exclude()
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
  courses: Course[];

  //
  @ManyToMany(() => Student, (students) => students.teachers, {
    cascade: true,
  })
  @JoinTable()
  students: Student[];
}
