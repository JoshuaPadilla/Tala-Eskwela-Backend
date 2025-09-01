import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { RfidService } from './rfid.service';
import { StudentsService } from 'src/users/students/students.service';

@Controller('rfid')
export class RfidController {
  constructor(
    private readonly rfidService: RfidService,
    private readonly studentService: StudentsService,
  ) {}

  @Post()
  async attendance(@Body() body: { rfid_tag_uid: string }) {
    const student = await this.studentService.findByRfidUid(body.rfid_tag_uid);

    if (!student) {
      throw new NotFoundException('Student Not Found');
    }

    return student;
  }
}
