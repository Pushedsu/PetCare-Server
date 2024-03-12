import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { JwtRefreshAuthGuard } from '../../auth/jwt/jwtRefresh-auth.guard';
import { HttpExceptionFilter } from '../../common/exceptions/http-exceptions.filter';
import { SuccessInterceptor } from '../../common/interceptors/success.interceptor';
import { UserSignupDto } from '../dto/user.signup.dto';
import { UserService } from '../service/user.service';
import { Request } from 'express';
import { Types } from 'mongoose';
import { User } from '../user.schema';
import { CurrentUser } from '../../common/decorator/custom.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseUserInfo } from '../dto/user.responseUserInfo.dto';
import { UserLoginResponseTokenDto } from '../dto/user.loginResponseToken.dto';
import { UserAccountDeleteDto } from '../dto/user.accountDelete.dto';
import { UserUpdateNameDto } from '../dto/user.updateName.dto';
import { UserUpdatePasswordDto } from '../dto/user.updatePassword.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { AwsService } from '../../aws/aws.service';
import { UserFindPasswordDto } from '../dto/user.findPassword.dto';
import { AuthLoginDto } from '../../auth/dto/auth.login.dto';

@Controller('user')
@ApiTags('User')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(SuccessInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly awsService: AwsService,
  ) {}

  @ApiOperation({ summary: '현재 로그인된 유저 정보 가져오기 API' })
  @ApiBearerAuth('token')
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @ApiResponse({
    status: 200,
    description: 'success: true, data: { 유저 정보 } ',
    type: UserResponseUserInfo,
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
    description: 'success: true\ndata:{ 유저정보 }',
    type: UserResponseUserInfo,
  })
  @Post('deleteUser')
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @CurrentUser() user: User,
    @Body() body: UserAccountDeleteDto,
  ) {
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
  async signUp(@Body() body: UserSignupDto) {
    await this.userService.signUp(body);
  }

  @ApiOperation({ summary: '유저 로그인 API' })
  @ApiResponse({
    status: 500,
    description: 'server error...',
  })
  @ApiResponse({
    status: 201,
    description: 'success: true, data: { 액세스 토큰, 리프레쉬 토큰 }',
    type: UserLoginResponseTokenDto,
  })
  @Post('login')
  async login(@Body() data: AuthLoginDto) {
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
    description: 'success: true, data: { 액세스 토큰 }',
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

  @ApiOperation({ summary: '이름 변경 API' })
  @ApiResponse({
    status: 201,
    description: 'success: true',
    type: UserUpdateNameDto,
  })
  @ApiResponse({
    status: 500,
    description: 'server error...',
  })
  @Post('updateName')
  async updateByName(@Body() body: UserUpdateNameDto) {
    return this.userService.updateName(body);
  }

  @ApiOperation({ summary: '비밀번호 변경 API' })
  @ApiResponse({
    status: 201,
    description: 'success: true',
    type: UserUpdatePasswordDto,
  })
  @ApiResponse({
    status: 500,
    description: 'server error...',
  })
  @Post('updatePassword')
  async updatePassword(@Body() body: UserUpdatePasswordDto) {
    return this.userService.updatePassword(body);
  }

  @ApiOperation({ summary: '유저 프로필 이미지 업로드' })
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @ApiResponse({
    status: 201,
    description: 'success: true',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  @Post('uploadImg')
  async uploadImg(
    @Body('id') id: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { key } = await this.awsService.uploadFileToS3('profileImg', file);
    const url = this.awsService.getAwsS3FileUrl(key);
    await this.userService.updateImgUrl(id, url);
    const data = { image: url };
    return data;
  }

  @ApiOperation({ summary: '유저 프로필 이미지 삭제' })
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @ApiResponse({
    status: 201,
    description: 'success: true',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @Post('deleteImg')
  async deleteImg(@Body('key') key: string) {
    await this.awsService.deleteS3Object(key);
  }

  @ApiOperation({ summary: '비밀번호 찾기 API' })
  @ApiResponse({
    status: 201,
    description: 'success: true',
    type: UserFindPasswordDto,
  })
  @ApiResponse({
    status: 500,
    description: 'server error...',
  })
  @Post('findPassword')
  async findPasswordById(@Body() body: UserFindPasswordDto) {
    return await this.userService.findPasswordById(body);
  }
}
