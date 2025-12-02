import { Student } from 'src/endpoints/users/students/entities/student.entity';

export interface StudentNotifData {
  title: string;
  body: string;
  classId: string;
  attendanceId: string;
  user: 'student';
}

export interface ParentNotifData {
  studentId: string;
  classId: string;
  title: string;
  body: string;
  user: 'parent';
  attendanceId: string;
}
