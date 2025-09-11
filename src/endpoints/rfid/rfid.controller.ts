import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { RfidService } from './rfid.service';
import { StudentsService } from 'src/endpoints/users/students/students.service';

@Controller('rfid')
export class RfidController {
  constructor(
    private readonly rfidService: RfidService,
    private readonly studentService: StudentsService,
  ) {}

  @Post()
  async tap(@Body() body: { rfid_tag_uid: string }) {
    this.rfidService.rfid_tap(body.rfid_tag_uid);
  }

  @HttpCode(HttpStatus.OK)
  @Post('tap')
  async readRfid(@Body() body: { uid: string }) {
    if (body.uid !== '2E60D65') {
      throw new NotFoundException(`User with ID ${body.uid} not found.`);
    }
  }
}
