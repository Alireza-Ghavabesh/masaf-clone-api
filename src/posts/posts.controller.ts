import { Controller, Post, Body, Query, Get } from "@nestjs/common";
import {
  ComplexFormDataDto,
  getPostFormDataDto,
  deletePostFormData,
  singlePostFormData,
  createCommentFormData,
  updateCommentFormData,
  deleteCommentFormData,
  toggleCommentLikeFormData,
  addToFavoriteFormDataDto,
  updateTopSiteBannerFormData,
  updateBottomLeftSiteBannerFormData,
  updateMidSiteBannerFormData,
  updateBottomRightSiteBannerFormData,
  getPostsByCursorFormData

} from "types"; // Import your DTO

import { FormDataRequest } from "nestjs-form-data";
import { PostsService } from "./posts.service";
import { PrismaService } from "src/prisma/prisma.service";

@Controller("api")
export class PostsController {
  constructor(private postService: PostsService, private prisma: PrismaService) { }

  @Post("addToFavorite")
  @FormDataRequest()
  async addToFavoritePost(@Body() formData: addToFavoriteFormDataDto): Promise<{}> {
    console.log(formData);
    try {
      const favorite = await this.postService.addToFavorite(formData);
      return {
        id: favorite.id,
        userId: favorite.userId,
        postId: favorite.postId,
        result: favorite.result
      }
    } catch (err) {
      return {
        err: err
      }
    }
  }

  @Post("post")
  @FormDataRequest()
  async handleFormData(@Body() formData: ComplexFormDataDto): Promise<{}> {
    console.log(formData);
    try {
      const result = await this.postService.createPost(formData);
      return { message: "post created" };
    } catch (err) {
      console.log(err)
      return err
    }
  }

  @Post("getPost")
  @FormDataRequest()
  async getPost(@Body() formData: getPostFormDataDto): Promise<{}[]> {
    const posts = await this.postService.getPost(formData);
    return posts;
  }

  @Post("deletePost")
  @FormDataRequest()
  async deletePost(@Body() formData: deletePostFormData): Promise<{}> {
    console.log(formData);
    const post = await this.postService.deletePost(formData);
    return post;
  }

  @Post("singlePost")
  @FormDataRequest()
  async getSinglePost(@Body() formData: singlePostFormData): Promise<{}> {
    const post = await this.postService.getSinglePost(formData);
    return post;
  }

  @Post("allPosts")
  async getAllPosts(): Promise<{}> {
    const posts = await this.postService.getAllPosts();
    return posts;
  }

  @Post("createComment")
  @FormDataRequest()
  async createComment(@Body() formData: createCommentFormData): Promise<{}> {
    console.log(formData.userId);
    const comment = await this.postService.createComment(formData);
    return comment;
  }

  @Post("updateComment")
  @FormDataRequest()
  async updateComment(@Body() formData: updateCommentFormData): Promise<{}> {
    const comment = await this.postService.updateComment(formData);
    return comment;
  }

  @Post("deleteComment")
  @FormDataRequest()
  async deleteComment(@Body() formData: deleteCommentFormData): Promise<{}> {
    const comment = await this.postService.deleteComment(formData);
    return comment;
  }

  @Post("toggleCommentLike")
  @FormDataRequest()
  async toggleCommentLike(@Body() formData: toggleCommentLikeFormData): Promise<{}> {
    const comment = await this.postService.toggleCommentLike(formData);
    return comment;
  }


  @Post("updateTopSiteBanner")
  @FormDataRequest()
  async updateTopSiteBannerUrl(@Body() formData: updateTopSiteBannerFormData) {
    try {
      const topSiteBannerUrl = await this.postService.updateTopSiteBannerUrl(formData);
      return topSiteBannerUrl;
    } catch (err) {
      return err
    }
  }

  @Post("updateBottomLeftSiteBanner")
  @FormDataRequest()
  async updateBottomLeftSiteBannerUrl(@Body() formData: updateBottomLeftSiteBannerFormData) {
    try {
      const bottomLeftSiteBannerUrl = await this.postService.updateBottomLeftSiteBannerUrl(formData);
      return bottomLeftSiteBannerUrl;
    } catch (err) {
      return err
    }
  }

  @Post("updateMidSiteBanner")
  @FormDataRequest()
  async updateMidSiteBannerUrl(@Body() formData: updateMidSiteBannerFormData) {
    try {
      const MidSiteBannerUrl = await this.postService.updateMidSiteBannerUrl(formData);
      return MidSiteBannerUrl;
    } catch (err) {
      return err
    }
  }

  @Post("updateBottomRightSiteBanner")
  @FormDataRequest()
  async updateBottomRightSiteBannerUrl(@Body() formData: updateBottomRightSiteBannerFormData) {
    try {
      const bottomRightSiteBannerUrl = await this.postService.updateBottomRightSiteBannerUrl(formData);
      return bottomRightSiteBannerUrl;
    } catch (err) {
      return err
    }
  }

  // @Get("SeedPost/sokhanrani")
  // @FormDataRequest()
  // async seed() {

  //   try {
  //     const range = Array.from({ length: 1 }, (_, index) => index + 1);
  //     const userId = JSON.stringify((await this.prisma.user.findFirst()).id);

  //     for (const number of range) {
  //       console.log(number);
  //       const fd = new FormData()

  //       // Function to create a mock Express.Multer.File from a real file
  //       function createFileFromPath(fieldname: string, filePath: string, mimetype: string): Express.Multer.File {
  //         const buffer = fs.readFileSync(filePath);
  //         return {
  //           fieldname: fieldname,
  //           originalname: filePath,
  //           encoding: '7bit',
  //           mimetype: mimetype,
  //           size: buffer.length,
  //           stream: null as any,
  //           destination: '',
  //           filename: filePath,
  //           path: filePath,
  //           buffer: buffer,
  //         };
  //       }

  //       // Paths to your files
  //       const audioPath = './src/posts/files/sample_audio.mp3';
  //       const videoPath = './src/posts/files/sample_video.mp4';
  //       const imagePath = './src/posts/files/sample_image.jpg';
  //       const thumbnailPath = './src/posts/files/sample_thumnail.jpg';

  //       const dummyFormData: ComplexFormDataDto = {
  //         postThumbnail: null,
  //         userid: userId,
  //         title: "Sample Title",
  //         content: "This is a sample content.",
  //         category: "Sample Category",
  //         videos: [
  //           {
  //             thumbnail: createFileFromPath('thumbnail', thumbnailPath, 'image/jpeg'),
  //             file: createFileFromPath('file', videoPath, 'video/mp4'),
  //             audios: [createFileFromPath('audio', audioPath, 'audio/mpeg')],
  //           },
  //         ],
  //         images: [
  //           createFileFromPath('image', imagePath, 'image/jpeg'),
  //         ],
  //       };

  //       console.log(dummyFormData);

  //       console.log(dummyFormData);
  //       this.postService.createPostWithRelatedData(dummyFormData)
  //     }
  //     return {
  //       result: "success"
  //     }

  //   } catch (err) {
  //     console.log(err)
  //     return {
  //       result: err
  //     }
  //   }
  // }

  @Post('postsByCursor')
  @FormDataRequest()
  async getPostsByCursor(
    @Body() formData: getPostsByCursorFormData
  ): Promise<any[]> {
    return this.postService.getPostsByCursor(formData);
  }


}
