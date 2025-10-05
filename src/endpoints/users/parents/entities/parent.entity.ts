import { Roles } from 'src/enums/role.enum';
import { Student } from 'src/endpoints/users/students/entities/student.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Parent {
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

  @Column({ type: 'enum', enum: Roles, default: Roles.PARENT })
  role: Roles;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  // Relations

  @OneToMany(() => Student, (student) => student.parent, {
    cascade: true,
  })
  students: Student[];
}
