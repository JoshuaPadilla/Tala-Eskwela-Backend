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
}
