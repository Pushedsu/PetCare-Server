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
import { AdminService } from '../service/admin.service';
import { ReportCreateDto } from '../dto/admin.create.dto';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exceptions.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Types } from 'mongoose';

@Controller('admin')
@ApiTags('Admin')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(SuccessInterceptor)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('createReport')
  async createReport(@Body() body: ReportCreateDto) {
    return await this.adminService.createReport(body);
  }

  @Post('deleteReport')
  async deleteReport(@Body('reportId') reportId: Types.ObjectId) {
    return await this.adminService.deleteReport(reportId);
  }

  @Get('getAllReports')
  async getAllReports(@Query('page') page: number) {
    return await this.adminService.getAllReports(page);
  }

  @Get('login')
  @Render('admin/login.ejs')
  async showAdminPage() {
    const adminInfo = await this.adminService.getAdminDetails();
    return { admin: adminInfo };
  }

  @Get('dashboard')
  @Render('admin/dashboard.ejs')
  async showDashboardPage() {
    const adminInfo = await this.adminService.getAdminDetails();
    return { admin: adminInfo };
  }

  @Post('signIn')
  async login(@Body() body, @Res() res: Response) {
    const { adminId, password } = body;
    if (adminId == process.env.ADMIN_ID || password == process.env.ADMIN_PW) {
      res.redirect('/admin/dashboard'); // 성공 시 대시보드로 리디렉션
    }
    res.redirect('/admin/login'); // 실패 시 로그인 페이지로 리디렉션
  }
}
