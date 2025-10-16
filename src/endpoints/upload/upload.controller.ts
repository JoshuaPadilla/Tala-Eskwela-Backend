import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Get,
  Param,
  UseGuards,
  Request,
  UnauthorizedException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { use } from 'passport';
import { JwtPayload } from 'src/common/types/jwt-payload.types';
import { Roles } from 'src/enums/role.enum';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { S3Service } from 'src/services/s3.service';
import { TeachersService } from '../users/teachers/teachers.service';
import { StudentsService } from '../users/students/students.service';
import { ParentsService } from '../users/parents/parents.service';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly uploadService: UploadService,
  ) {}

  @UseGuards(JwtAuthGuard)
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
    @Body() body: { userId: string; role: Roles },
  ) {
    console.log(body);

    const fileUrl = await this.s3Service.uploadProfile(file, body.userId);

    await this.uploadService.updateProfile(body.role, body.userId, fileUrl);

    // Return the URL to your Expo app
    return {
      message: 'File uploaded successfully',
      profileUrl: fileUrl,
    };
  }
}
