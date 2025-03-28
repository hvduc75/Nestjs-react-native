import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './entity/song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { UploadService } from '../upload/upload.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

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
        // 20*10,
      );
      console.log('Saved to cache:', result);
    } catch (error) {
      console.error('Cache set error:', error);
    }

    return { source: 'database', data: songs };
  }
}
