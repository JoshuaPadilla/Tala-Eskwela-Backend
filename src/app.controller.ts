import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { NotificationsService } from './notifications/notifications.service';
import { RFID_MODE } from './enums/rfid_mode.enum';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly notificationService: NotificationsService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('change_mode')
  async change_mode(@Body() body: { mode: RFID_MODE }) {
    const { mode } = body;
    await this.appService.change_mode(mode);

    console.log(mode);
  }
}
