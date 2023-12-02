import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exceptions.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { PostsCreateDto } from '../dto/posts.create.dto';
import { PostsService } from '../service/posts.service';

@Controller('posts')
@ApiTags('Post')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(SuccessInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: '게시글 작성하기 API' })
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @ApiResponse({
    status: 201,
    description: 'data: { 유저 정보 } ',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @Post('posting')
  async creatPost(@Body() body: PostsCreateDto) {
    await this.postsService.posting(body);
  }

  @ApiOperation({ summary: '좋아요 +1 API' })
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @ApiResponse({
    status: 200,
    description: '성공 여부',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @Put(':id')
  async plusLike(@Param('id') id: string) {
    await this.postsService.plusLike(id);
  }

  @ApiOperation({ summary: '모든 게시글 Load API' })
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @ApiResponse({
    status: 201,
    description: 'data: { 유저 정보 } ',
    schema: {
      example: {
        success: true,
        data: [
          {
            _id: '641...',
            author: '63d885e...',
            contents: '이 편지는 영국에서 시...',
            name: '홍길동',
            title: '제목',
            likeCount: 0,
            createdAt: '2023-00-00T10:55:50.563Z',
            updatedAt: '2023-00-00T10:55:50.563Z',
            __v: 0,
          },
        ],
      },
    },
  })
  @Get('all')
  getPosts() {
    return this.postsService.getAllPosts();
  }

  @ApiOperation({ summary: '내글 보기 API' })
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @ApiResponse({
    status: 201,
    description: 'data: { 유저 정보 } ',
    schema: {
      example: {
        success: true,
        data: [
          {
            _id: '641...',
            author: '63d885e...',
            contents: '이 편지는 영국에서 시...',
            name: '홍길동',
            title: '제목',
            likeCount: 0,
            createdAt: '2023-00-00T10:55:50.563Z',
            updatedAt: '2023-00-00T10:55:50.563Z',
            __v: 0,
          },
        ],
      },
    },
  })
  @Get(':id')
  async getMyposts(@Param('id') id: string) {
    return await this.postsService.getMyPosts(id);
  }

  @ApiOperation({ summary: '본문 검색 API' })
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @ApiResponse({
    status: 201,
    description: 'data: { 유저 정보 } ',
    schema: {
      example: {
        success: true,
        data: [
          {
            _id: '641...',
            author: '63d885e...',
            contents: '이 편지는 영국에서 시...',
            name: '홍길동',
            title: '제목',
            likeCount: 0,
            createdAt: '2023-00-00T10:55:50.563Z',
            updatedAt: '2023-00-00T10:55:50.563Z',
            __v: 0,
          },
        ],
      },
    },
  })
  @Post('searchContents')
  async contentsSearch(@Body() body) {
    const { text } = body;
    return await this.postsService.searchContents(text);
  }

  @ApiOperation({ summary: '제목 검색 API' })
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @ApiResponse({
    status: 201,
    description: 'data: { 유저 정보 } ',
    schema: {
      example: {
        success: true,
        data: [
          {
            _id: '641...',
            author: '63d885e...',
            contents: '이 편지는 영국에서 시...',
            name: '홍길동',
            title: '제목',
            likeCount: 0,
            createdAt: '2023-00-00T10:55:50.563Z',
            updatedAt: '2023-00-00T10:55:50.563Z',
            __v: 0,
          },
        ],
      },
    },
  })
  @Post('searchTitle')
  async titleSearch(@Body() body) {
    const { text } = body;
    return await this.postsService.searchTitle(text);
  }
}
