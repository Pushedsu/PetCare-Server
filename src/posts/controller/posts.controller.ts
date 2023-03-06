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
import { PostsReqDto } from '../dto/posts.req.dto';
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
  async creatPost(@Body() body: PostsReqDto) {
    await this.postsService.posting(body);
  }

  @Put(':id')
  async plusLike(@Param('id') id: string) {
    await this.postsService.plusLike(id);
  }

  @Get('all')
  getPosts() {
    return this.postsService.getAllPosts();
  }
}
