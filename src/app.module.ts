import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './core/config/DatabaseModule';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './core/interceptors/response.interceptor';
import { AuthModule } from './core/auth/auth.module';

@Module({
  imports: [UsersModule, DatabaseModule, AuthModule],
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
