// src/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { Expo, ExpoPushTicket } from 'expo-server-sdk';
import { NotificationData } from './interfaces/notification-data.interface';

@Injectable()
export class NotificationsService {
  private expo: Expo;

  constructor() {
    this.expo = new Expo();
  }

  async sendAttendanceNotification(
    expoPushTokens: string[],
    data?: NotificationData,
  ) {
    if (!Expo.isExpoPushToken(expoPushTokens[0])) {
      console.error(
        `Push token ${expoPushTokens[0]} is not a valid Expo push token`,
      );
      return;
    }

    const messages = expoPushTokens.map((token) => ({
      to: token,
      sound: 'default',
      ...data,
    }));

    // The Expo push notification service will handle the rest.
    const chunks = this.expo.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = [];

    // Send chunks in parallel to the Expo push notification service.
    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(`Error sending push notification chunk: ${error}`);
      }
    }

    // You can handle the tickets to check for errors or receipts if needed.
    // Example: Getting push notification receipts
    const receiptIds: string[] = [];
    for (const ticket of tickets) {
      if (ticket.status === 'ok') {
        receiptIds.push(ticket.id);
      }
    }

    const receiptIdChunks =
      this.expo.chunkPushNotificationReceiptIds(receiptIds);

    for (const chunk of receiptIdChunks) {
      try {
        const receipts =
          await this.expo.getPushNotificationReceiptsAsync(chunk);
        console.log('Notification Receipts:', receipts);
      } catch (error) {
        console.error(`Error getting notification receipts: ${error}`);
      }
    }
  }
}
