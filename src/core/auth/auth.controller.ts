import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { ResponseMessage } from '../decorators/response.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Fetch login')
  async handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }
}
