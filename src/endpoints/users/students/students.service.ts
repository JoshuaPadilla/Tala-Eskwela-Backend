import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { In, Repository } from 'typeorm';
import { RegisterStudentDto } from 'src/common/dto/register-student.dto';
import { hashPassword } from 'src/common/helpers/passwordHelpers';

import { UpdateStudentDto } from './dto/update-student.dto';
import { Cache } from 'cache-manager';
import { RFID_MODE } from 'src/enums/rfid_mode.enum';
import { Class } from 'src/endpoints/class/entities/class.entity';
import { ParentsService } from '../parents/parents.service';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @Inject('CACHE_MANAGER') private cache: Cache,
    private readonly parentService: ParentsService,
  ) {}

  private studentIdToRegister: string | null = null;

  async registerStudent(
    registerStudentDto: RegisterStudentDto,
  ): Promise<Student> {
    const hashedPassword = await hashPassword(registerStudentDto.password);

    const newStudent = await this.studentRepository.save({
      ...registerStudentDto,
      password: hashedPassword,
    });

    return newStudent;
  }

  async findAll(query: Partial<Omit<Student, 'password'>>): Promise<Student[]> {
    const qb = this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.class', 'class')
      .leftJoinAndSelect('student.parent', 'parent');

    Object.entries(query).forEach(([key, value]) => {
      if (key === 'class' && value === 'null') {
        // special case → advisory_class is NULL
        qb.andWhere('student.class IS NULL');
      } else {
        qb.andWhere(`student.${key} = :${key}`, { [key]: value });
      }
    });

    return qb.getMany();
  }

  async findById(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['class', 'parent', 'parent.push_token'],
    });
    if (!student) {
      throw new NotFoundException('No Student found');
    }

    return student;
  }

  async findByEmail(email: string) {
    return this.studentRepository.findOne({ where: { email } });
  }

  async findByRfidUid(uid: string) {
    const student = await this.studentRepository.findOne({
      where: { rfid_tag_uid: uid },
      relations: ['class', 'parent', 'class.class_teacher'],
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
    console.log('ID!!!!:', id);
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) {
      throw new BadRequestException('Student not found');
    }

    await this.studentRepository.remove(student);
  }

  async setStudentToRegister(id: string) {
    await this.cache.set('rfid_mode', RFID_MODE.REGISTER);

    this.setStudentIdToRegister(id);
  }

  async registerStudentUuid(uuid: string) {
    const id = this.getStudentIdToRegister();

    if (!id) {
      await this.cache.set('rfid_mode', RFID_MODE.READ);
      throw new BadRequestException('student id not found');
    }

    const studentToUpdate = await this.studentRepository.preload({
      id,
      rfid_tag_uid: uuid,
    });

    if (!studentToUpdate) {
      await this.cache.set('rfid_mode', RFID_MODE.READ);
      throw new BadRequestException('Student not found');
    }

    await this.cache.set('rfid_mode', RFID_MODE.READ);
    return this.studentRepository.save(studentToUpdate);
  }

  async addClass(students: Student[], classObj: Class) {
    for (const student of students) {
      student.class = classObj;
    }

    return await this.studentRepository.save(students);
  }

  async addParent(student_id: string, parent_id: string) {
    const student = await this.studentRepository.findOne({
      where: { id: student_id },
      relations: ['parent'],
    });

    if (!student) {
      throw new NotFoundException('student not found');
    }

    const parent = await this.parentService.addStudent(parent_id, student);

    student.parent = parent;

    await this.studentRepository.save(student);

    const { students, ...parentToReturn } = parent;

    return parentToReturn;
  }

  // getters and setters
  getStudentIdToRegister() {
    return this.studentIdToRegister;
  }

  private setStudentIdToRegister(id: string) {
    this.studentIdToRegister = id;
  }
}
