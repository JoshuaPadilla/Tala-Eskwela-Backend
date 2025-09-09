import { Class } from 'src/endpoints/class/entities/class.entity';
import { Student } from 'src/endpoints/users/students/entities/student.entity';
import { ATTENDANCE_STATUS } from 'src/enums/attendance-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  attendance_id: string;

  @Column({
    type: 'enum',
    enum: ATTENDANCE_STATUS,
    default: ATTENDANCE_STATUS.ABSENT,
  })
  status: ATTENDANCE_STATUS;

  //Relations
  @CreateDateColumn()
  timestamp: Date;

  @OneToMany(() => Student, (student) => student.attendances)
  student: Student;

  @OneToMany(() => Class, (aclass) => aclass.attendance_records)
  class: Class;
}
