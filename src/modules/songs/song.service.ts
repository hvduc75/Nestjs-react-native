import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './entity/song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { UploadService } from '../upload/upload.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { createReadStream, statSync } from 'fs';
import { Response } from 'express';
import axios from 'axios';
import { UsersService } from '../users/users.service';
import { NotificationService } from '../notifications/notification.service';
import { GatewayService } from '../gateway/gateway.service';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
    private readonly uploadService: UploadService,
    private readonly userService: UsersService,
    private readonly notificationRepo: NotificationService,
    private readonly socketGateway: GatewayService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(
    createSongDto: CreateSongDto,
    imageFile?: Express.Multer.File,
    songFile?: Express.Multer.File,
  ) {
    if (imageFile) {
      createSongDto.imageUrl = await this.uploadService.uploadFile(imageFile);
    }
    if (songFile) {
      createSongDto.songUrl = await this.uploadService.uploadFile(songFile);
    }

    const song = this.songRepository.create({
      name: createSongDto.songName,
      ...createSongDto,
    });
    let data = await this.songRepository.save(song);
    // Gửi thông báo đến Admins
    const admins = await this.userService.getAllAdmins(); // Lấy danh sách admin từ UserService
    console.log('Admins:', admins);
    await Promise.all(
      admins.map(async (admin) => {
        const notification = await this.notificationRepo.createNotification(
          `Bài hát "${song.name}" đang chờ duyệt.`,
          admin.id,
          song.id,
        );

        console.log(
          `Notification created for admin ${admin.id}: ${notification.message}`)
    
        const socketId = this.socketGateway.userSocketMap.get(admin.id);
        if (socketId) {
          this.socketGateway.server.to(socketId).emit('new-notification', {
            message: notification.message,
            songId: song.id,
            createdAt: notification.createdAt,
          });
        } else {
          console.warn(`Admin ${admin.id} is not connected via WebSocket.`);
        }
      }),
    );
    return data;
  }

  async getRecommendSongs() {
    const cacheKey = 'recommend_songs';

    // Kiểm tra cache
    console.log('Checking cache for recommend songs...');
    const cachedSongs = await this.cacheManager.get(cacheKey);
    console.log('Cache result:', cachedSongs);
    if (cachedSongs) {
      return { source: 'cache', data: JSON.parse(cachedSongs as string) }; // 👈 Parse lại JSON
    }

    // Nếu cache không có, truy vấn database
    const songs = await this.songRepository.find({ take: 10 });

    // Lưu vào cache, kiểm tra lỗi
    try {
      const result = await this.cacheManager.set(
        cacheKey,
        JSON.stringify(songs),
        200000,
      );
      console.log('Saved to cache:', result);
    } catch (error) {
      console.error('Cache set error:', error);
    }

    return { source: 'database', data: songs };
  }

  async getSong(id: number, req: Request, res: Response) {
    const song = await this.songRepository.findOne({
      where: { id },
    });

    if (!song) {
      throw new BadRequestException('Song not found');
    }

    const fileUrl = song.songUrl;

    if (!fileUrl) {
      throw new BadRequestException('Invalid file URL');
    }

    console.log('Headers:', req.headers);
    const range = req.headers['range'] as string | undefined;
    if (!range) {
      console.log('No range header provided, streaming partial file...');
      // Giả lập một yêu cầu Range để trả về 1MB đầu tiên
      const partialRange = 'bytes=0-1048575'; // 1MB = 1024 * 1024 bytes
      const response = await axios.get(fileUrl, {
        responseType: 'stream',
        headers: { Range: partialRange },
      });

      const fileStream = response.data;
      const headers = response.headers;

      res.set({
        'Content-Type': headers['content-type'],
        'Content-Length': headers['content-length'],
        'Content-Range': headers['content-range'],
        'Accept-Ranges': 'bytes',
      });
      res.status(206); // Partial Content
      fileStream.pipe(res);
      return;
      // return this.streamFullFile(fileUrl, res);
    }
    console.log('Range:', range);

    try {
      const response = await axios.get(fileUrl, {
        responseType: 'stream',
        headers: { Range: range },
      });

      const fileStream = response.data;
      const headers = response.headers;

      res.set({
        'Content-Type': headers['content-type'],
        'Content-Length': headers['content-length'],
        'Content-Range': headers['content-range'],
        'Accept-Ranges': 'bytes',
      });
      res.status(206);
      fileStream.pipe(res);
    } catch (error) {
      throw new BadRequestException('Error retrieving song from Cloudinary');
    }
  }

  private async streamFullFile(fileUrl: string, res: Response) {
    try {
      const response = await axios.get(fileUrl, {
        responseType: 'stream',
      });
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', response.headers['content-length']);

      response.data.pipe(res);
    } catch (error) {
      throw new BadRequestException('Error retrieving song from Cloudinary');
    }
  }

  async getAllSongs() {
    const songs = await this.songRepository.find({
      select: {
        id: true,
        name: true,
        artist: true,
        imageUrl: true,
        songUrl: true,
      },
    });
    return songs;
  }
}
