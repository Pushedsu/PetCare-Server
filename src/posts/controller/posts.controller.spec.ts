import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from '../service/posts.service';
import { PostsCreateDto } from '../dto/posts.create.dto';
import { ObjectId, Types } from 'mongoose';
import { Posts } from '../posts.schema';

describe('PostsController', () => {
  let controller: PostsController;
  let postsService: PostsService;

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
    postsService = module.get<PostsService>(PostsService);
  });

  describe('posting', () => {
    it('posting 메서드 호출 성공', async () => {
      //given
      const postsCreateData: PostsCreateDto = {
        author: '63d885ebc32e1d123456789a',
        contents: '이 편지는 영국에서 시작된 행운의 편지입니다...',
        title: '새로운 시작',
        name: '홍길동',
      };
      //when
      const spy = jest.spyOn(postsService, 'posting');
      await controller.creatPost(postsCreateData);
      //then
      expect(spy).toBeCalledWith(postsCreateData);
    });
  });

  describe('plusLike', () => {
    it('plusLike 메서드 호출 성공', async () => {
      //given
      const randomObjectId = new Types.ObjectId().toString();
      //when
      const spy = jest.spyOn(postsService, 'plusLike');
      await controller.plusLike(randomObjectId);
      //then
      expect(spy).toBeCalledWith(randomObjectId);
    });
  });

  describe('getPosts', () => {
    it('getAllPosts 메서드 호출 검증', async () => {
      //given
      const getAllPostsReturnValue: Partial<Posts>[] = [
        {
          _id: new Types.ObjectId(),
          author: '63d885ebc32e1d123456789a',
          contents: '이 편지는 영국에서 시작된 행운의 편지입니다...',
          name: '홍길동',
          title: '새로운 시작',
          likeCount: 15,
          __v: 0,
        },
        {
          _id: new Types.ObjectId(),
          author: '63d885ebc32e1d987654321b',
          contents: '이번 주말에는 새로운 카페를 방문해 보세요...',
          name: '이순신',
          title: '주말 추천 카페',
          likeCount: 5,
          __v: 0,
        },
        {
          _id: new Types.ObjectId(),
          author: '63d885ebc32e1dabcdef1234',
          contents: '내일은 마라톤 대회가 있습니다. 모두 화이팅!',
          name: '장보고',
          title: '마라톤 대회 참가',
          likeCount: 30,
          __v: 0,
        },
      ];
      //when
      jest
        .spyOn(postsService, 'getAllPosts')
        .mockResolvedValue(
          getAllPostsReturnValue as (Posts & { _id: ObjectId })[],
        );
      const result = await controller.getPosts();
      //then
      expect(result).toEqual(getAllPostsReturnValue);
    });
  });

  describe('getMyPosts', () => {
    it('getMyPosts 메서드 리턴 값 검증', async () => {
      //given
      const randomObjectId = new Types.ObjectId().toString();
      const getAllPostsReturnValue: Partial<Posts>[] = [
        {
          _id: '641a7b2e0f8b2a1c12345678',
          author: '63d885ebc32e1d123456789a',
          contents: '이 편지는 영국에서 시작된 행운의 편지입니다...',
          name: '홍길동',
          title: '새로운 시작',
          likeCount: 15,
        },
      ];
      //when
      jest
        .spyOn(postsService, 'getMyPosts')
        .mockResolvedValue(
          getAllPostsReturnValue as (Posts & { _id: ObjectId })[],
        );
      const result = await controller.getMyposts(randomObjectId);
      //then
      expect(result).toEqual(getAllPostsReturnValue);
    });
  });

  describe('contentsSearch', () => {
    it('searchContents 리턴 값 성공 검증', async () => {
      //given
      const text = '이 편지는 영국에서 시작된 행운의 편지입니다...';
      const randomObjectId = new Types.ObjectId();
      const returnValue: Partial<Posts>[] = [
        {
          _id: randomObjectId,
          author: '63d885ebc32e1d123456789a',
          contents: '이 편지는 영국에서 시작된 행운의 편지입니다...',
          name: '홍길동',
          title: '새로운 시작',
          likeCount: 15,
          __v: 0,
        },
      ];
      //when
      jest
        .spyOn(postsService, 'searchContents')
        .mockResolvedValue(returnValue as (Posts & { _id: ObjectId })[]);
      const result = await controller.contentsSearch(text);
      //then
      expect(result).toEqual(returnValue);
    });
  });

  describe('titleSearch', () => {
    it('searchTitle', async () => {
      //given
      const text = '새로운 시작';
      const randomObjectId = new Types.ObjectId();
      const returnValue: Partial<Posts>[] = [
        {
          _id: randomObjectId,
          author: '63d885ebc32e1d123456789a',
          contents: '이 편지는 영국에서 시작된 행운의 편지입니다...',
          name: '홍길동',
          title: '새로운 시작',
          likeCount: 15,
          __v: 0,
        },
      ];
      //when
      jest
        .spyOn(postsService, 'searchTitle')
        .mockResolvedValue(returnValue as (Posts & { _id: ObjectId })[]);
      const result = await controller.titleSearch(text);
      //then
      expect(result).toEqual(returnValue);
    });
  });
});
