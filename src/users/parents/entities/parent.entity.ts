import { Roles } from 'src/enums/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Parent {
  @PrimaryGeneratedColumn()
  parent_id: number;

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
  phone_number: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.PARENT })
  role: Roles;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
