import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Get,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { SongService } from './song.service';
import { Response } from 'express';
import { idSchema } from 'src/core/validations/id.validation';
import { CreateSongDto } from './dto/create-song.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/core/decorators/response.decorator';

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

  @Get('get-Recommend-Songs')
  async getRecommendSongs() {
    return await this.songService.getRecommendSongs();
  }

  @Get('get-song/:id')
  @Public()
  getSong(@Param('id') id: number, @Req() req: Request, @Res() res: Response) {
    res.setHeader('Content-Type', 'audio/mpeg');
    return this.songService.getSong(id, req, res);
  }

  @Get('get-all-songs')
  @Public()
  async getAllSongs() {
    return await this.songService.getAllSongs();
  }
}
