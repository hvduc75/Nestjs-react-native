import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { hashPasswordHelper } from 'src/core/helpers/utils';

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
    console.log('createUserDto', createUserDto);
    let hashPassword = await hashPasswordHelper(createUserDto.password);
    console.log('hashPassword', hashPassword);
    if (!hashPassword) {
      throw new BadRequestException('Hashing password failed.');
    }
    createUserDto.password = hashPassword;
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async getUserById(userId: number) {
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  async getAllUser() {
    return await this.userRepository.find();
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getAllAdmins() {
    return await this.userRepository.find({
      where: { role: 'Admin' },
    });
  }
}
