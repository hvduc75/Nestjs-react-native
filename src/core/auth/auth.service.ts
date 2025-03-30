import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from '../helpers/utils';
import { UsersService } from '../../modules/users/users.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import admin from '../config/firebase.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (!user) return null;

    // const isValidPassword = await comparePasswordHelper(pass, user.password);
    // if (!isValidPassword) return null;
    return user;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    return {
      user: {
        email: user.email,
        id: user.id,
        name: user.name
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async handleRegister(registerDto: CreateAuthDto) {
    return await this.usersService.create(registerDto);
  }

  async verifyToken(idToken: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken; // Trả về thông tin user từ token
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
