import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';

@Module({
  providers: [GatewayService],
  exports: [GatewayService], // Export để sử dụng ở các module khác
})
export class GatewayModule {}