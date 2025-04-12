import { Body, Controller, Param, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { idSchema } from 'src/core/validations/id.validation';
import { Public } from 'src/core/decorators/response.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get('get-user/:userId')
  async getUserById(
    @Param('userId', new ZodValidationPipe(idSchema)) userId: number,
  ) {
    return await this.usersService.getUserById(userId);
  }

  @Get('get-all')
  async getAllUser() {
    return await this.usersService.getAllUser();
  }
}
