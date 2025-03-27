import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { MulterFile } from './interfaces/multer-file.interface';

@Injectable()
export class UploadService {
  constructor(@Inject('CLOUDINARY') private cloudinary) {}

  async uploadFile(file: MulterFile): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: 'uploads', resource_type: 'auto' },
          (error, result) => {
            if (error) return reject(error);

            if (!result) {
              return reject(new Error('Upload failed, result is undefined'));
            }

            resolve(result.secure_url); // Chỉ truy cập khi chắc chắn result tồn tại
          },
        )
        .end(file.buffer);
    });
  }
}
