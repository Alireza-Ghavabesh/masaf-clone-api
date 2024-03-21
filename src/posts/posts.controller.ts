import { Controller, Post, Body } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  createPost(
    @Body()
    postData: {
      title: string;
      content: string;
      date: string;
      score: number;
      category: string;
      authorId: number;
    },
  ) {
    return this.postsService.createPost(postData);
  }
}
