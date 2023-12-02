import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostsCreateDto } from '../dto/posts.create.dto';
import { Posts } from '../posts.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private readonly postsModel: Model<Posts>,
  ) {}

  async posting(body: PostsCreateDto) {
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

  async searchContents(text: string) {
    const searchContents = await this.postsModel
      .find({
        contents: { $regex: `${text}`, $options: 'i' },
      })
      .sort({ createdAt: -1 });
    return searchContents;
  }

  async searchTitle(text: string) {
    const searchTitlePost = await this.postsModel
      .find({
        title: { $regex: `${text}`, $options: 'i' },
      })
      .sort({ createdAt: -1 });
    console.log(searchTitlePost);
    return searchTitlePost;
  }
}
