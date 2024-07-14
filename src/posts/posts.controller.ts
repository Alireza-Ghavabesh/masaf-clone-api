import { Controller, Post, Body } from "@nestjs/common";
import { ComplexFormDataDto, getPostFormDataDto, deletePostFormData } from "types"; // Import your DTO

import { FormDataRequest } from "nestjs-form-data";
import { PostsService } from "./posts.service";

@Controller("api")
export class PostsController {
  constructor(private postService: PostsService) {}

  @Post("post")
  @FormDataRequest()
  async handleFormData(@Body() formData: ComplexFormDataDto): Promise<{}> {
    console.log(formData);

    const result = await this.postService.createPost(formData);
    return { message: "post created" };
  }

  @Post("getPost")
  @FormDataRequest()
  async getPost(@Body() formData: getPostFormDataDto): Promise<{}[]> {
    const posts = await this.postService.getPost(formData);
    return posts;
  }


  @Post('deletePost')
  @FormDataRequest()
  async deletePost(@Body() formData: deletePostFormData): Promise<{}>{
    const post = await this.postService.deletePost(formData);
    return post;
  }
}
