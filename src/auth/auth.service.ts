import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { AuthLoginDto } from './dto/auth.login.dto';
import { jwtDecode } from 'jwt-decode';
import { UserService } from 'src/user/service/user.service';

interface MyJwtPayload {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean; // 명시적으로 정의
  at_hash: string;
  nonce: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
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

  async verifyToken(idToken: string) {
    const decoded = jwtDecode(idToken) as MyJwtPayload;

    const confirmUser = await this.userRepository.findUserByEmail(
      decoded.email,
    );

    const signUpData = {
      email: decoded.email,
      name: decoded.given_name,
      password: process.env.OAUTH_PASSWORD,
    };
    const loginData: AuthLoginDto = {
      email: decoded.email,
      password: process.env.OAUTH_PASSWORD,
    };

    if (!confirmUser) {
      let confirmName = await this.userRepository.ExistsByName(
        decoded.given_name,
      );
      while (confirmName) {
        const randomNumber = Math.floor(Math.random() * 1000);
        const rename = decoded.given_name + randomNumber;

        confirmName = await this.userRepository.ExistsByName(rename);

        if (!confirmName) {
          signUpData.name = rename;
        }
      }

      await this.userService.signUp(signUpData);
    }

    return this.login(loginData);
  }
}
