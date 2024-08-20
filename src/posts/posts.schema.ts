import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';
import { Document } from 'mongoose';
import { Report } from 'src/admin/admin.schema';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Posts extends Document {
  @ApiProperty({
    example: '63d885e...',
    description: 'User Object.Id',
  })
  @Prop({ required: true })
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    example: '이 편지는 영국에서 시...',
    description: '게시글',
  })
  @Prop({ required: true })
  @IsNotEmpty()
  contents: string;

  @ApiProperty({
    example: '민수',
    description: '글쓴이',
  })
  @Prop({ required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '제목',
    description: '게시글 제목',
  })
  @Prop({ required: true })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '좋아요 수',
  })
  @Prop({
    default: 0,
  })
  @IsPositive()
  likeCount: number;

  readonly reports: Report[];
}

export const _PostsSchema = SchemaFactory.createForClass(Posts);

_PostsSchema.virtual('report', {
  ref: 'report',
  localField: '_id',
  foreignField: 'postId',
});

_PostsSchema.set('toObject', { virtuals: true });
_PostsSchema.set('toJSON', { virtuals: true });

export const PostsSchema = _PostsSchema;
