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

  @HttpCode(HttpStatus.OK)
  @Post()
  async tap(@Body() body: { rfid_tag_uid: string }) {
    console.log(body);
    return await this.rfidService.rfid_tap(body.rfid_tag_uid);
  }
}
