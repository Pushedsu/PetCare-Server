import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GooglAuthGuard } from './google/google.guard';
import { AuthService } from './auth.service';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/service/user.service';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exceptions.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
  ) {}

  @Post('google/idToken')
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(SuccessInterceptor)
  async googleSignInToken(@Body('idToken') idToken: string) {
    return await this.authService.verifyToken(idToken);
  }

  @Get('google')
  @UseGuards(GooglAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleLogin(@Req() req) {}

  @Get('redirect')
  @UseGuards(GooglAuthGuard)
  async googleLoginCallback(@Req() req, @Res() res) {
    const confirmUser = await this.userRepository.findUserByEmail(
      req.user.email,
    );
    const signUpData = {
      email: req.user.email,
      name: req.user.firstName,
      password: process.env.OAUTH_PASSWORD,
    };
    const loginData = {
      email: req.user.email,
      password: process.env.OAUTH_PASSWORD,
    };
    if (!confirmUser) {
      let confirmName = await this.userRepository.ExistsByName(
        req.user.firstName,
      );
      while (confirmName) {
        const randomNumber = Math.floor(Math.random() * 1000);
        const rename = req.user.firstName + randomNumber;

        confirmName = await this.userRepository.ExistsByName(rename);

        if (!confirmName) {
          signUpData.name = rename;
        }
      }

      await this.userService.signUp(signUpData);
    }

    return await this.authService.login(loginData);
  }
}
