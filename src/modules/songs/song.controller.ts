import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { SongService } from './song.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { idSchema } from 'src/core/validations/id.validation';
import { CreateSongDto } from './dto/create-song.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imageUrl', maxCount: 1 },
      { name: 'songUrl', maxCount: 1 },
    ]),
  )
  async create(
    @Body() createSongDto: CreateSongDto,
    @UploadedFiles()
    files: {
      imageUrl?: Express.Multer.File[];
      songUrl?: Express.Multer.File[];
    },
  ) {
    return await this.songService.create(
      createSongDto,
      files.imageUrl?.[0], 
      files.songUrl?.[0],
    );
  }
}
