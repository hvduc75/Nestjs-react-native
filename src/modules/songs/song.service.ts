import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './entity/song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
    private readonly uploadService: UploadService,
  ) {}

  async create(createSongDto: CreateSongDto, imageFile?: Express.Multer.File, songFile?: Express.Multer.File) {
    if (imageFile) {
      createSongDto.imageUrl = await this.uploadService.uploadFile(imageFile);
    }
    if (songFile) {
      createSongDto.songUrl = await this.uploadService.uploadFile(songFile);
    }

    const song = this.songRepository.create(createSongDto);
    return await this.songRepository.save(song);
  }
}
