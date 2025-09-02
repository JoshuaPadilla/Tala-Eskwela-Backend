import { Student } from 'src/endpoints/users/students/entities/student.entity';
import { Teacher } from 'src/endpoints/users/teachers/entities/teacher.entity';
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

@Entity()
export class Class {
  @PrimaryGeneratedColumn('uuid')
  class_id: string;

  @Column({ type: 'text' })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  // Relations

  @OneToOne(() => Teacher)
  @JoinColumn()
  class_teacher: Teacher;

  @ManyToMany(() => Student, (student) => student.classes, { cascade: true })
  @JoinTable()
  students: Student[];
}
