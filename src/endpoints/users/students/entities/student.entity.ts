import { Roles } from 'src/enums/role.enum';
import { Parent } from 'src/endpoints/users/parents/entities/parent.entity';
import { Teacher } from 'src/endpoints/users/teachers/entities/teacher.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Class } from 'src/endpoints/class/entities/class.entity';
import { Attendance } from 'src/endpoints/attendance/entities/attendance.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  rfid_tag_uid: string;

  @Column({ nullable: true })
  push_token: string;

  @Column({ type: 'text' })
  first_name: string;

  @Column({ type: 'text' })
  last_name: string;

  @Column({ type: 'text' })
  middle_name: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  @Exclude()
  password: string;

  @Column({ type: 'text' })
  phone: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.STUDENT })
  role: Roles;

  @Column({ type: 'text', nullable: true })
  profileUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  // Relations

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendances: Attendance[];

  @ManyToOne(() => Class, (classes) => classes.students)
  @JoinColumn({ name: 'class_id' }) // <-- Add this decorator
  class: Class;

  @ManyToOne(() => Parent, (parent) => parent.students)
  parent: Parent;
}
