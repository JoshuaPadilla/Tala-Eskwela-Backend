import { Injectable } from '@nestjs/common';
import { RegisterParentDto } from '../../../common/dto/register-parent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Parent } from './entities/parent.entity';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/common/helpers/passwordHelpers';
import { ParentInterface } from 'src/common/interfaces/parent.interface';

@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parent)
    private parentRepository: Repository<Parent>,
  ) {}
  async registerParent(
    registerParentDto: RegisterParentDto,
  ): Promise<ParentInterface> {
    const hashedPassword = await hashPassword(registerParentDto.password);

    const newParent = await this.parentRepository.save({
      ...registerParentDto,
      password: hashedPassword,
    });

    return newParent;
  }

  async findAll(): Promise<ParentInterface[]> {
    return this.parentRepository.find();
  }

  async findByEmail(email: string) {
    return this.parentRepository.findOne({ where: { email } });
  }
}
