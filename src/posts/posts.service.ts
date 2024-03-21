import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { Post as PostModel } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(data: {
    title: string;
    content: string;
    date: string;
    score: number;
    category: string;
    authorId: number;
  }): Promise<PostModel> {
    return this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        date: data.date,
        score: data.score,
        category: data.category,
        author: {
          connect: { id: data.authorId },
        },
      },
    });
  }
}
