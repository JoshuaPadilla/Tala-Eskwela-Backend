import { Module } from '@nestjs/common';
import { S3Service } from 'src/services/s3.service';
import { UploadController } from './upload.controller';

@Module({
  controllers: [UploadController],
  providers: [S3Service],
})
export class UploadModule {}
