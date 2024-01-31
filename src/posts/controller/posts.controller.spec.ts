import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from '../service/posts.service';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const mockPostsService = {
    posting: jest.fn(),
    plusLike: jest.fn(),
    getAllPosts: jest.fn(),
    getMyPosts: jest.fn(),
    searchContents: jest.fn(),
    searchTitle: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [{ provide: PostsService, useValue: mockPostsService }],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  describe('posting', () => {
    it('회원 가입', async () => {
      //given
      //when
      //then
    });
  });
});
