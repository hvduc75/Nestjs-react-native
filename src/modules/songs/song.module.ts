import { Module } from '@nestjs/common';
import { SongController } from './song.controller';
import { SongService } from './song.service';
import { Song } from './entity/song.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadModule } from '../upload/upload.module';
import { RedisConfigModule } from 'src/core/config/redis.config';
import { UsersModule } from '../users/users.module';
import {NotificationModule} from '../notifications/notification.module';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [TypeOrmModule.forFeature([Song]), UploadModule, RedisConfigModule, UsersModule, NotificationModule, GatewayModule],
  controllers: [SongController],
  providers: [SongService],
  exports: [SongService],
})
export class SongModule {}
