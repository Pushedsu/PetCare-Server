import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './jwt/jwt-accesstoken.strategy';
import { RefreshTokenStrategy } from './jwt/jwt-refreshtoken.strategy';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google/google.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '30m' },
    }),
    //모듈을 불러와 public으로 설정한 클래스들을 불러올 수 있다.
    forwardRef(() => UserModule),
  ],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
