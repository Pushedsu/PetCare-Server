import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Report } from '../admin.schema';
import { ReportCreateDto } from '../dto/admin.create.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Report.name) private readonly reportsModel: Model<Report>,
  ) {}

  async createReport(body: ReportCreateDto) {
    return await this.reportsModel.create(body);
  }

  async deleteReport(reportId: Types.ObjectId) {
    return await this.reportsModel.deleteOne({ _id: reportId });
  }

  // 특정 게시글의 모든 신고를 삭제하는 함수
  async deleteReportsByPostId(postId: Types.ObjectId) {
    return await this.reportsModel.deleteMany({ postId });
  }

  async getAdminDetails() {
    return 'Test'; // 예시로 첫 번째 관리자 반환
  }

  async getAllReports(page: number) {
    const limit = 10;
    return await this.reportsModel
      .find()
      .skip(page * limit)
      .limit(limit)
      .exec();
  }
}
