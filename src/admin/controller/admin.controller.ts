import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Render,
  Res,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from '../service/admin.service';
import { ReportCreateDto } from '../dto/admin.create.dto';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exceptions.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { Response } from 'express';
import { Types } from 'mongoose';

@Controller('admin')
@ApiTags('Admin')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(SuccessInterceptor)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: '리포트 생성 기능' })
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @Post('createReport')
  async createReport(@Body() body: ReportCreateDto) {
    return await this.adminService.createReport(body);
  }

  @ApiOperation({ summary: '리포트 삭제 기능' })
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @Post('deleteReport')
  async deleteReport(@Body('reportId') reportId: Types.ObjectId) {
    return await this.adminService.deleteReport(reportId);
  }

  @ApiOperation({ summary: '모든 리포트 Load API' })
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @Get('getAllReports')
  async getAllReports(@Query('page') page: number) {
    return await this.adminService.getAllReports(page);
  }

  @ApiOperation({ summary: '관리자 모드 로그인 화면' })
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @Get('login')
  @Render('admin/login.ejs')
  async showAdminPage() {
    const adminInfo = await this.adminService.getAdminDetails();
    return { admin: adminInfo };
  }

  @ApiOperation({ summary: '관리자 모드 화면 렌더링' })
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @Get('dashboard')
  @Render('admin/dashboard.ejs')
  async showDashboardPage() {
    const adminInfo = await this.adminService.getAdminDetails();
    return { admin: adminInfo };
  }

  @ApiOperation({ summary: '관리자 모드 로그인 기능' })
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @Post('signIn')
  async login(@Body() body, @Res() res: Response) {
    const { adminId, password } = body;
    if (adminId == process.env.ADMIN_ID || password == process.env.ADMIN_PW) {
      return res.redirect('/admin/dashboard'); // 성공 시 대시보드로 리디렉션
    }
    return res.redirect('/admin/login'); // 실패 시 로그인 페이지로 리디렉션
  }
}
