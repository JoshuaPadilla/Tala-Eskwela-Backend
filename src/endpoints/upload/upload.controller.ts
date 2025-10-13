import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/services/s3.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('profile_picture')
  @UseInterceptors(FileInterceptor('profile_picture')) // 'picture' is the field name from your Expo form-data
  async uploadPicture(
    @UploadedFile(
      // Optional: Add built-in NestJS file validation pipes
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // Max 5MB
          new FileTypeValidator({ fileType: 'image/(jpeg|png|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const fileUrl = await this.s3Service.uploadFile(file);

    // Return the URL to your Expo app
    return {
      message: 'File uploaded successfully',
      url: fileUrl,
    };
  }
}
