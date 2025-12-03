import { Class } from 'src/endpoints/class/entities/class.entity';
import { Student } from 'src/endpoints/users/students/entities/student.entity';
import { ATTENDANCE_STATUS } from 'src/enums/attendance-status.enum';
import { text } from 'stream/consumers';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ATTENDANCE_STATUS,
    default: ATTENDANCE_STATUS.ABSENT,
  })
  status: ATTENDANCE_STATUS;

  @Column({ type: 'text', nullable: true })
  scheduleId: string;

  //Relations
  @Column({
    type: 'timestamptz',
    default: () => "CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila'",
  })
  timestamp: Date;

  @ManyToOne(() => Student, (student) => student.attendances, {
    onDelete: 'CASCADE',
  })
  student: Student;

  @ManyToOne(() => Class, (aclass) => aclass.attendance_records)
  class: Class;
}
