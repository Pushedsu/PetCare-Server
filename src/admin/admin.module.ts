import { Module } from '@nestjs/common';
import { AdminController } from './controller/admin.controller';
import { AdminService } from './service/admin.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './admin.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
