import { PickType } from '@nestjs/swagger';
import { Posts } from '../posts.schema';

export class PostsCreateDto extends PickType(Posts, [
  'author',
  'contents',
  'title',
  'name',
] as const) {}
