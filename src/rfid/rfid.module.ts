import { Module } from '@nestjs/common';
import { RfidService } from './rfid.service';
import { RfidController } from './rfid.controller';
import { StudentsService } from 'src/users/students/students.service';
import { StudentsModule } from 'src/users/students/students.module';

@Module({
  controllers: [RfidController],
  providers: [RfidService],
  imports: [StudentsModule],
})
export class RfidModule {}
