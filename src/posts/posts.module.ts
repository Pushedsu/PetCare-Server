import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './controller/posts.controller';
import { Posts, PostsSchema } from './posts.schema';
import { PostsService } from './service/posts.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostModule {}
