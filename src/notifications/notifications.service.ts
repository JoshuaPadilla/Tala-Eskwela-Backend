// src/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { Expo, ExpoPushTicket } from 'expo-server-sdk';
import {
  ParentNotifData,
  StudentNotifData,
} from './interfaces/notification-data.interface';

@Injectable()
export class NotificationsService {
  private expo: Expo;

  constructor() {
    this.expo = new Expo();
  }

  async sendParentNotif(expoPushToken: string, data: ParentNotifData) {
    if (!Expo.isExpoPushToken(expoPushToken)) {
      console.error(
        `Push token ${expoPushToken} is not a valid Expo push token`,
      );
      return;
    }

    const { title, body, ...rest } = data;

    const message = {
      title,
      body,
      to: expoPushToken,
      sound: 'default',
      data: { ...rest },
    };

    // The Expo push notification service will handle the rest.
    const chunks = this.expo.chunkPushNotifications([message]);
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

  async sendStudentNotif(expoPushToken: string, data: StudentNotifData) {
    if (!Expo.isExpoPushToken(expoPushToken)) {
      console.error(
        `Push token ${expoPushToken} is not a valid Expo push token`,
      );
      return;
    }

    console.log('Student:', data);

    const { title, body, ...rest } = data;

    const messages = [
      {
        title,
        body,
        to: expoPushToken,
        sound: 'default',
        data: {
          ...rest,
        },
      },
    ];

    console.log(messages[0]);

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
