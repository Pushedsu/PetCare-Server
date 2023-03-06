import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginReqDto } from 'src/auth/dto/login.req.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRefreshAuthGuard } from 'src/auth/jwt/jwtRefresh-auth.guard';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exceptions.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { UserReqDto } from '../dto/user.request.dto';
import { UserService } from '../service/user.service';
import { Request } from 'express';
import { Types } from 'mongoose';
import { User } from '../user.schema';
import { CurrentUser } from 'src/common/decorator/custom.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResDto } from '../dto/user.res.dto';
import { LoginResDto } from '../dto/user.req.login.dto';
import { UserDeleteReqDto } from '../dto/user.delete.req.dto';

@Controller('user')
@ApiTags('User')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(SuccessInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '현재 로그인된 유저 정보 가져오기 API' })
  @ApiBearerAuth('token')
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @ApiResponse({
    status: 200,
    description: 'data: { 유저 정보 } ',
    type: UserResDto,
  })
  @Get('userInfo')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user: User) {
    return user.readOnlyData;
  }

  @ApiOperation({ summary: '유저 회원 탈퇴' })
  @ApiBearerAuth('token')
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @ApiResponse({
    status: 200,
    description: 'success: true',
    type: UserResDto,
  })
  @Post('deleteUser')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@CurrentUser() user: User, @Body() body: UserDeleteReqDto) {
    await this.userService.deleteUser(user.id, body);
  }

  @ApiOperation({ summary: '유저 회원가입 API' })
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @ApiResponse({
    status: 201,
    description: '성공 여부',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @Post('signUp')
  async signUp(@Body() body: UserReqDto) {
    await this.userService.signUp(body);
  }

  @ApiOperation({ summary: '유저 로그인 API' })
  @ApiResponse({
    status: 500,
    description: 'server error...',
  })
  @ApiResponse({
    status: 201,
    description: 'data: { 액세스 토큰, 리프레쉬 토큰 }',
    type: LoginResDto,
  })
  @Post('login')
  async login(@Body() data: LoginReqDto) {
    return await this.authService.login(data);
  }

  @ApiOperation({ summary: '유저 로그아웃 API' })
  @ApiResponse({ status: 500, description: 'server error...' })
  @ApiResponse({
    status: 200,
    description: '성공 여부',
    schema: { example: { success: true } },
  })
  @Delete(':id')
  async logout(@Param('id') id: Types.ObjectId) {
    await this.userService.logout(id);
  }

  @ApiOperation({ summary: '로그인 유지 API' })
  @ApiBearerAuth('token')
  @ApiResponse({ status: 500, description: 'server error...' })
  @ApiResponse({
    status: 200,
    description: 'data: { 액세스 토큰 }',
    schema: {
      example: {
        access_token: 'wer23w31r2...',
      },
    },
  })
  @Get('getAccessToken')
  @UseGuards(JwtRefreshAuthGuard)
  async issueByRefreshToken(@Req() req: Request) {
    const token = req.user['refreshToken'];
    const id = req.user['id'];
    return await this.authService.validateByRefreshToken(id, token);
  }

  @ApiOperation({ summary: '모든 유저 데이터 가져오기' })
  @ApiResponse({
    status: 200,
    description: 'data: { 유저 정보 } ',
    schema: {
      example: {
        email: '~~',
        name: '~~',
        id: '63d885e...',
        posts: [
          {
            _id: '~~',
            author: '63d885e...',
            contents: 'hello world',
            createdAt: '~~',
            updatedAt: '~~',
            __v: 0,
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 500, description: 'server error...' })
  @Get('all')
  getAllUser() {
    return this.userService.getUserAllData();
  }
}
