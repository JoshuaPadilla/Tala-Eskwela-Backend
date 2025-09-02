import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { RegisterStudentDto } from 'src/common/dto/register-student.dto';
import { hashPassword } from 'src/common/helpers/passwordHelpers';
import { StudentInterface } from 'src/common/interfaces/student.interface';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}
  async registerStudent(
    registerStudentDto: RegisterStudentDto,
  ): Promise<StudentInterface> {
    const hashedPassword = await hashPassword(registerStudentDto.password);

    const newStudent = await this.studentRepository.save({
      ...registerStudentDto,
      password: hashedPassword,
    });

    return newStudent;
  }

  async findAll(): Promise<StudentInterface[]> {
    const students = await this.studentRepository.find();

    return students;
  }

  async findByEmail(email: string): Promise<StudentInterface | null> {
    return this.studentRepository.findOne({ where: { email } });
  }

  async findByRfidUid(uid: string): Promise<StudentInterface | null> {
    return this.studentRepository.findOne({ where: { rfid_tag_uid: uid } });
  }
}
