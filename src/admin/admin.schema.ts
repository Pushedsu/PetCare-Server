import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Document } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Report extends Document {
  @ApiProperty({
    example: '63d885e...',
    description: '게시글 Object.Id',
  })
  @Prop({ required: true, type: Types.ObjectId })
  postId: Types.ObjectId;

  @ApiProperty({
    example: '63d885e...',
    description: '신고자 이름',
  })
  @Prop({ required: true })
  reporterName: string;

  @ApiProperty({
    example: '폭언..',
    description: '신고 이유',
  })
  @Prop({ required: true })
  reason: string;

  @ApiProperty({
    example: '이 편지는 영국에서 부터...',
    description: '본문',
  })
  @Prop({ required: true })
  contents: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
