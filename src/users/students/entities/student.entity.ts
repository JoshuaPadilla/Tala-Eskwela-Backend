import { Roles } from 'src/enums/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  student_id: number;

  @Column()
  rfid_tag_uid: string;

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
  phone: string;

  @Column({ type: 'text' })
  grade_lvl: string;

  @Column({ type: 'text' })
  class_id: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.STUDENT })
  role: Roles;

  @Column({ type: 'text' })
  guardian_id?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
