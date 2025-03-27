import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { SongModule } from './modules/songs/song.module';
import { DatabaseModule } from './core/config/DatabaseModule';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { TransformInterceptor } from './core/interceptors/response.interceptor';
import { AuthModule } from './core/auth/auth.module';
import { JwtAuthGuard } from './core/auth/passport/jwt-auth.guard';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [UsersModule, DatabaseModule, AuthModule, SongModule, UploadModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
