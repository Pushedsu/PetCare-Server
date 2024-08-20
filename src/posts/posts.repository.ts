import { InjectModel } from '@nestjs/mongoose';
import { Posts } from './posts.schema';
import { Model, Types } from 'mongoose';
import { Report } from 'src/admin/admin.schema';

export class PostsRepository {
  constructor(
    @InjectModel(Posts.name) private readonly postsModel: Model<Posts>,
    @InjectModel(Report.name) private readonly reportsModel: Model<Report>,
  ) {}
  async posting(author: string, contents: string, title: string, name: string) {
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
    return post.save();
  }

  async getAllPosts() {
    return await this.postsModel.find().sort({ createdAt: -1 });
  }

  async getMyPosts(id: string) {
    return await this.postsModel.find({ author: id }).sort({ createdAt: -1 });
  }

  async searchContents(text: string) {
    return await this.postsModel
      .find({ contents: { $regex: text, $options: 'i' } })
      .sort({ createdAt: -1 });
  }

  async searchTitle(text: string) {
    return await this.postsModel
      .find({ title: { $regex: text, $options: 'i' } })
      .sort({ createdAt: -1 });
  }

  async deletePost(id: Types.ObjectId) {
    const post = await this.postsModel.findByIdAndDelete(id);
    await this.reportsModel.deleteMany({ postId: id });
    return post;
  }
}
