import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entity/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  // Tạo thông báo mới
  async createNotification(message: string, recipientId?: number, songId?: number) {
    const notification = this.notificationRepository.create({
      message,
      recipientId,
      songId,
    });
    return await this.notificationRepository.save(notification);
  }

  // Lấy tất cả thông báo
  async getAllNotifications() {
    return await this.notificationRepository.find();
  }

  // Lấy thông báo theo người nhận
  async getNotificationsByRecipient(recipientId: number) {
    return await this.notificationRepository.find({ where: { recipientId } });
  }

  // Đánh dấu thông báo là đã đọc
  async markAsRead(notificationId: number) {
    const notification = await this.notificationRepository.findOne({ where: { id: notificationId } });
    if (notification) {
      notification.isRead = true;
      return await this.notificationRepository.save(notification);
    }
    return null;
  }
}