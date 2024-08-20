import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './controller/posts.controller';
import { Posts, PostsSchema } from './posts.schema';
import { PostsService } from './service/posts.service';
import { PostsRepository } from './posts.repository';
import { Report, ReportSchema } from 'src/admin/admin.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: Posts.name, schema: PostsSchema },
      { name: Report.name, schema: ReportSchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  exports: [PostsRepository],
})
export class PostModule {}
