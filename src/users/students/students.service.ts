import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentsService {
  registerStudent() {
    console.log('new student registered');
  }
}
