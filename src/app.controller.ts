import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { NotificationsService } from './notifications/notifications.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly notificationService: NotificationsService,
  ) {}

  @Get()
  sendNotification() {
    this.notificationService.sendAttendanceNotification(
      ['ExponentPushToken[cQh4FYLA_OOgCV0TeQH4kh]'],
      { screen: 'welcome home' },
    );
  }
}
