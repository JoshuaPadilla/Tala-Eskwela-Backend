import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { hashPassword } from 'src/common/helpers/passwordHelpers';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto) {
    const hashedPassword = await hashPassword(createAdminDto.password);

    const newAdmin = await this.adminRepository.save({
      ...createAdminDto,
      password: hashedPassword,
    });

    return newAdmin;
  }

  async getAllAdmin() {
    return await this.adminRepository.find();
  }

  async deleteAdmin(id: string) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new BadRequestException('Cant delete, Admin not found');
    }
    await this.adminRepository.remove(admin);
  }

  async findById(id: string) {
    const admin = await this.adminRepository.findOne({
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException('cant find ID, Admin not found');
    }

    return admin;
  }

  async findByEmail(email: string) {
    const admin = await this.adminRepository.findOne({
      where: { email: email },
      // relations: ['teached_courses', 'students'],
    });

    return admin;
  }
}
