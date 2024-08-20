import { Injectable } from '@nestjs/common';
import { PostsCreateDto } from '../dto/posts.create.dto';
import { PostsRepository } from '../posts.repository';
import { Types } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async posting(body: PostsCreateDto) {
    const { author, contents, title, name } = body;
    return await this.postsRepository.posting(author, contents, title, name);
  }

  async plusLike(id: string) {
    return await this.postsRepository.plusLike(id);
  }

  async getAllPosts() {
    return await this.postsRepository.getAllPosts();
  }

  async getMyPosts(id: string) {
    return await this.postsRepository.getMyPosts(id);
  }

  async searchContents(text: string) {
    return await this.postsRepository.searchContents(text);
  }

  async searchTitle(text: string) {
    return await this.postsRepository.searchTitle(text);
  }

  async deletePost(postId: Types.ObjectId) {
    return await this.postsRepository.deletePost(postId);
  }
}
