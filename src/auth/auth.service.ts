import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { AuthLoginDto } from './dto/auth.login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateByRefreshToken(id: Types.ObjectId, token: string) {
    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw new UnauthorizedException('id가 존재하지 않습니다');
    }

    if (token !== user.refreshToken) {
      throw new UnauthorizedException('리프레쉬 토큰이 일치하지 않습니다');
    }

    const payload = { email: user.email, sub: id };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: '30m',
      }),
    };
  }

  async login(data: AuthLoginDto) {
    const { email, password } = data;

    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('이메일이 존재하지 않습니다');
    }
    const checkPassword: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!checkPassword) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
    }

    const payload = { email: email, sub: user.id };

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_JWT_SECRET_KEY,
      expiresIn: '7d',
    });

    await this.userRepository.updateFieldById(user.id, refreshToken);

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: '30m',
      }),
      refresh_token: refreshToken,
    };
  }
}
