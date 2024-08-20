import { PickType } from '@nestjs/swagger';
import { Report } from '../admin.schema';

export class ReportCreateDto extends PickType(Report, [
  'postId',
  'reporterName',
  'reason',
  'contents',
] as const) {}
