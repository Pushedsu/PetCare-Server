import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PostsRepository } from '../posts.repository';
import { PostsCreateDto } from '../dto/posts.create.dto';
import { Posts } from '../posts.schema';
import { ObjectId, Types } from 'mongoose';

const mockRepository = {
  posting: jest.fn(),
  plusLike: jest.fn(),
  getAllPosts: jest.fn(),
  getMyPosts: jest.fn(),
  searchContents: jest.fn(),
  searchTitle: jest.fn(),
};

describe('PostsService', () => {
  let postsService: PostsService;
  let postsRepository: PostsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: PostsRepository, useValue: mockRepository },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    postsRepository = module.get<PostsRepository>(PostsRepository);
  });

  describe('posting', () => {
    it('posting 반환 값 성공한 케이스 검증 ', async () => {
      //given
      const randomObjectId = new Types.ObjectId().toString();
      const postsCreateData: PostsCreateDto = {
        author: randomObjectId.toString(),
        contents: '이 편지는 영국에서 시작된 행운의 편지입니다...',
        title: '새로운 시작',
        name: '홍길동',
      };

      const returnValue: Partial<Posts> = {
        _id: new Types.ObjectId(),
        author: randomObjectId,
        contents: '이 편지는 영국에서 시작된 행운의 편지입니다...',
        title: '새로운 시작',
        name: '홍길동',
        __v: 0,
      };
      //when
      jest
        .spyOn(postsRepository, 'posting')
        .mockResolvedValue(returnValue as Posts & { _id: ObjectId });
      const result = await postsService.posting(postsCreateData);
      //then
      expect(result).toEqual(returnValue);
    });
  });

  describe('plusLike', () => {
    it('plusLike 반환 값 성공한 케이스 검증 ', async () => {
      //given
      const randomObjectId = new Types.ObjectId().toString();
      const returnValue: Partial<Posts> = {
        _id: new Types.ObjectId(),
        author: randomObjectId,
        contents: '이 편지는 영국에서 시작된 행운의 편지입니다...',
        title: '새로운 시작',
        name: '홍길동',
        __v: 0,
      };
      //when
      jest
        .spyOn(postsRepository, 'plusLike')
        .mockResolvedValue(returnValue as Posts & { _id: ObjectId });
      const result = await postsService.plusLike(randomObjectId);
      //then
      expect(result).toEqual(returnValue);
    });
  });

  describe('getAllPosts', () => {
    it('getAllPosts 반환 값 성공한 케이스 검증 ', async () => {
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
        .spyOn(postsRepository, 'getAllPosts')
        .mockResolvedValue(
          getAllPostsReturnValue as (Posts & { _id: ObjectId })[],
        );
      const result = await postsService.getAllPosts();
      //then
      expect(result).toEqual(getAllPostsReturnValue);
    });
  });

  describe('getMyPosts', () => {
    it('getMyPosts 반환 값 성공한 케이스 검증 ', async () => {
      //given
      const randomObjectId = new Types.ObjectId().toString();
      const getMyPostsReturnValue: Partial<Posts>[] = [
        {
          _id: new Types.ObjectId(),
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
        .spyOn(postsRepository, 'getMyPosts')
        .mockResolvedValue(
          getMyPostsReturnValue as (Posts & { _id: ObjectId })[],
        );
      const result = await postsService.getMyPosts(randomObjectId);
      //then
      expect(result).toEqual(getMyPostsReturnValue);
    });
  });

  describe('searchContents', () => {
    it('searchContents 반환 값 성공한 케이스 검증 ', async () => {
      //given
      const text = '이 편지는 영국에서 시작된 행운의 편지입니다...';
      const returnValue: Partial<Posts>[] = [
        {
          _id: '641a7b2e0f8b2a1c12345678',
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
        .spyOn(postsRepository, 'searchContents')
        .mockResolvedValue(returnValue as (Posts & { _id: ObjectId })[]);
      const result = await postsService.searchContents(text);
      //then
      expect(result).toEqual(returnValue);
    });
  });

  describe('searchTitle', () => {
    it('searchTitle 반환 값 성공한 케이스 검증 ', async () => {
      //given
      const text = '새로운 시작';
      const returnValue: Partial<Posts>[] = [
        {
          _id: '641a7b2e0f8b2a1c12345678',
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
        .spyOn(postsRepository, 'searchTitle')
        .mockResolvedValue(returnValue as (Posts & { _id: ObjectId })[]);
      const result = await postsService.searchTitle(text);
      //then
      expect(result).toEqual(returnValue);
    });
  });
});
