import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  isEmailExist = async (email: string) => {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ? true : false;
  };

  async create(createUserDto: CreateUserDto) {
    // check email exist
    const isEmailExist = await this.isEmailExist(createUserDto.email);
    if (isEmailExist === true) {
      throw new BadRequestException(
        `Email đã tồn tại: ${createUserDto.email}. Vui lòng sử dụng email khác.`,
      );
    }
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async getUserById(userId: number) {
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  async getAllUser() {
    return await this.userRepository.find();
  }
}
