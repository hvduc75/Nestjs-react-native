import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])], // Đăng ký entity
  providers: [NotificationService],
  exports: [NotificationService], // Export để sử dụng ở các module khác
})
export class NotificationModule {}