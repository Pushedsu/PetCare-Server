import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Posts } from '../posts.schema';
import { Model } from 'mongoose';

describe('PostsService', () => {
  let service: PostsService;
  let model: Model<Posts>;

  const mockPostService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getModelToken(Posts.name), useValue: mockPostService },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    model = module.get<Model<Posts>>(getModelToken(Posts.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
