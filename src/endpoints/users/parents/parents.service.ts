import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterParentDto } from '../../../common/dto/register-parent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Parent } from './entities/parent.entity';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/common/helpers/passwordHelpers';
import { ParentInterface } from 'src/common/interfaces/parent.interface';
import { UpdateParentDto } from './dto/update-parent.dto';
import { Student } from '../students/entities/student.entity';

@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parent)
    private parentRepository: Repository<Parent>,
  ) {}
  async registerParent(registerParentDto: RegisterParentDto): Promise<Parent> {
    const hashedPassword = await hashPassword(registerParentDto.password);

    const newParent = await this.parentRepository.save({
      ...registerParentDto,
      password: hashedPassword,
    });

    return newParent;
  }

  async findAll(): Promise<Parent[]> {
    return this.parentRepository.find();
  }

  async getParentWithoutSpecificStudent(student_id: string) {
    return (
      this.parentRepository
        .createQueryBuilder('parent')
        // 1. LEFT JOIN the 'students' relation
        // Alias the joined students table as 'student'
        .leftJoin(
          'parent.students',
          'student',
          // 2. Add a condition for the LEFT JOIN to only include the student ID we *don't* want.
          // This is crucial for the logic: it tries to find the unwanted student.
          'student.id = :studentId',
          { studentId: student_id },
        )
        // 3. Select the Parent entity
        .select('parent')
        // 4. Filter the results
        // The parent entity is included ONLY IF the LEFT JOIN *failed* to find a matching student.
        // When the join fails, the 'student.id' column will be NULL for that parent row.
        .where('student.id IS NULL')
        .getMany()
    ); // or .getOne() if you expect at most one such parent
  }

  async findById(id: string): Promise<Parent> {
    const parent = await this.parentRepository.findOne({ where: { id } });

    if (!parent) {
      throw new NotFoundException('No Parent found');
    }

    return parent;
  }

  async findByEmail(email: string): Promise<Parent | null> {
    return this.parentRepository.findOne({ where: { email } });
  }

  async updateParent(id: string, updateForm: UpdateParentDto): Promise<Parent> {
    const parentToUpdate = await this.parentRepository.preload({
      id,
      ...updateForm,
    });

    if (!parentToUpdate) {
      throw new BadRequestException('Parent not found');
    }

    return this.parentRepository.save(parentToUpdate);
  }

  async deleteParent(id: string): Promise<void> {
    const parent = await this.parentRepository.findOne({ where: { id } });
    if (!parent) {
      throw new BadRequestException('Parent not found');
    }
    await this.parentRepository.remove(parent);
  }

  async addStudent(parent_id: string, student: Student) {
    const parent = await this.parentRepository.findOne({
      where: { id: parent_id },
      relations: ['students'],
    });

    if (!parent) {
      throw new NotFoundException('parent not found');
    }

    parent.students = [...parent.students, student];

    return await this.parentRepository.save(parent);
  }
}
