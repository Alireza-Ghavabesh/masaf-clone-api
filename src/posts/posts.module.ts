import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  providers: [PrismaService, PostsService],
  controllers: [PostsController],
  imports: [NestjsFormDataModule ]
})
export class PostsModule {}
