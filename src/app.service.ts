import { Injectable } from '@nestjs/common';
import { AttendanceGateway } from './gateways/attendance-gateway';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly attendanceGateway: AttendanceGateway,
    private readonly configService: ConfigService,
  ) {}

  tapRfid() {
    this.attendanceGateway.handleRfidTap();
  }
}
