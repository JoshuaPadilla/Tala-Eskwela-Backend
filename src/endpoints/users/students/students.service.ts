import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { RegisterStudentDto } from 'src/common/dto/register-student.dto';
import { hashPassword } from 'src/common/helpers/passwordHelpers';
import { StudentInterface } from 'src/common/interfaces/student.interface';
import { UpdateStudentDto } from './dto/update-student.dto';

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

  async findById(id: string) {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException('No Student found');
    }

    return student;
  }

  async findByEmail(email: string): Promise<StudentInterface | null> {
    return this.studentRepository.findOne({ where: { email } });
  }

  async findByRfidUid(uid: string): Promise<StudentInterface> {
    const student = await this.studentRepository.findOne({
      where: { rfid_tag_uid: uid },
    });

    if (!student) {
      throw new NotFoundException(`Cant find student with ${uid} rfid_uid`);
    }

    return student;
  }

  async updateStudent(id: string, updateForm: UpdateStudentDto) {
    const studentToUpdate = await this.studentRepository.preload({
      id,
      ...updateForm,
    });

    if (!studentToUpdate) {
      throw new BadRequestException('Student not found');
    }

    return this.studentRepository.save(studentToUpdate);
  }

  async deleteStudent(id: string) {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) {
      throw new BadRequestException('Teacher not found');
    }
    await this.studentRepository.remove(student);
  }
}
