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

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
    private readonly uploadService: UploadService,
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

    const song = this.songRepository.create(createSongDto);
    return await this.songRepository.save(song);
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

    const range = req.headers['range'] as string | undefined;
    if (!range) {
      return this.streamFullFile(fileUrl, res);
    }

    try {
      const response = await axios.get(fileUrl, {
        responseType: 'stream',
        headers: { Range: range },
      });
      const fileStream = response.data;
      const fileSize = parseInt(response.headers['content-length'], 10);

      const data = await axios.get(fileUrl, {
        responseType: 'stream',
      });
      const totalFileSize = parseInt(data.headers['content-length'], 10);

      const rangeHeader = range.match(/bytes=(\d+)-(\d+)?/);
      if (!rangeHeader) {
        throw new BadRequestException('Invalid range header');
      }
      let start = parseInt(rangeHeader[1], 10);
      let end = rangeHeader[2] ? parseInt(rangeHeader[2], 10) : fileSize - 1;

      const contentLength = end - start + 1;

      res.set({
        'Content-Range': `bytes ${start}-${end}/${totalFileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'audio/mpeg',
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
      },
    });
    return songs;
  }
}
