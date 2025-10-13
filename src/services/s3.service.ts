import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.getOrThrow<string>('BUCKET_NAME');

    this.s3Client = new S3Client({
      region: this.configService.getOrThrow<string>('BUCKET_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('ACCESS_KEY'),
        secretAccessKey:
          this.configService.getOrThrow<string>('SECRET_ACCESS_KEY'),
      },
    });
  }

  /**
   * Uploads a file buffer to S3.
   * @param file The file object from Multer.
   * @returns The public URL of the uploaded file.
   */
  async uploadFile(file: Express.Multer.File): Promise<string> {
    // Generate a unique file name to prevent collisions
    const fileExtension = file.originalname.split('.').pop();
    const uniqueKey = `${uuid()}.${fileExtension}`;

    const params: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: uniqueKey,
      Body: file.buffer, // The file content as a Buffer
      ContentType: file.mimetype,
      ACL: 'public-read', // Makes the file publicly accessible via URL
    };

    const command = new PutObjectCommand(params);

    try {
      await this.s3Client.send(command);
      // Construct the public URL (S3 public access should be enabled for this to work)
      return `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${uniqueKey}`;
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw new Error('Could not upload file to S3.');
    }
  }
}
