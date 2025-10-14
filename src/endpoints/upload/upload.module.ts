import { Module } from '@nestjs/common';
import { S3Service } from 'src/services/s3.service';
import { UploadController } from './upload.controller';
import { TeachersService } from '../users/teachers/teachers.service';
import { ParentsService } from '../users/parents/parents.service';
import { StudentsService } from '../users/students/students.service';
import { TeachersModule } from '../users/teachers/teachers.module';
import { ParentsModule } from '../users/parents/parents.module';
import { StudentsModule } from '../users/students/students.module';
import { UploadService } from './upload.service';

@Module({
  controllers: [UploadController],
  providers: [S3Service, UploadService],
  imports: [TeachersModule, ParentsModule, StudentsModule],
})
export class UploadModule {}
