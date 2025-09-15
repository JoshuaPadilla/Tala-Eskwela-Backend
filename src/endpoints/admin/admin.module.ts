import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { AdminController } from './admin.controller';
import { TeachersService } from '../users/teachers/teachers.service';

@Module({
  providers: [AdminService],
  imports: [TypeOrmModule.forFeature([Admin])],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
