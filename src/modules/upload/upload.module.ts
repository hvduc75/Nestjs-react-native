import { Module } from '@nestjs/common';
import { CloudinaryProvider } from 'src/core/config/cloudinary.config';
import { UploadService } from './upload.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryProvider, UploadService],
  exports: [ UploadService],
})
export class UploadModule {}
