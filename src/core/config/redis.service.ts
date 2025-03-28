import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async checkRedisConnection() {
    try {
      // Thử set và get một giá trị để kiểm tra Redis
      await this.cacheManager.set('test_key', 'Hello Redis1',  0 );
      const value = await this.cacheManager.get('test_key');
      console.log('Redis Test Value:', value);
      
      return value ? 'Redis is connected!' : 'Redis connection failed!';
    } catch (error) {
      console.error('Error connecting to Redis:', error);
      return 'Redis connection failed!';
    }
  }  
}
