import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostsReqDto } from '../dto/posts.req.dto';
import { Posts } from '../posts.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private readonly postsModel: Model<Posts>,
  ) {}

  async posting(body: PostsReqDto) {
    const { author, contents, title, name } = body;
    const newPost = new this.postsModel({
      author,
      contents,
      title,
      name,
    });
    return await newPost.save();
  }

  async plusLike(id: string) {
    const post = await this.postsModel.findById(id);
    post.likeCount += 1;
    return await post.save();
  }

  async getAllPosts() {
    const allPosts = await this.postsModel.find().sort({ createdAt: -1 });
    return allPosts;
  }

  async getMyPosts(id: string) {
    const myPosts = await this.postsModel
      .find({ author: id })
      .sort({ createdAt: -1 });
    return myPosts;
  }
}
