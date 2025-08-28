import { Injectable } from '@nestjs/common';

@Injectable()
export class TeachersService {
  registerTeacher() {
    console.log('new teacher');
  }
}
