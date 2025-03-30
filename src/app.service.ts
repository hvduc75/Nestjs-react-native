import { Injectable  } from '@nestjs/common';
// import { RedisService } from './core/config/redis.service';

@Injectable()
export class AppService {
  // constructor(private readonly redisService: RedisService) {}

  // async onModuleInit() {
  //   const redisStatus = await this.redisService.checkRedisConnection();
  //   console.log(redisStatus);
  // }

  getHello(): string {
    return 'Hello World!';
  }
}
