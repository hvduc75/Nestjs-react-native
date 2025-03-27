import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './core/config/DatabaseModule';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './core/interceptors/response.interceptor';

@Module({
  imports: [UsersModule, DatabaseModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
