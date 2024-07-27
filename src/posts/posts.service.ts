import { Injectable } from "@nestjs/common";
import { PrismaService } from "./../prisma/prisma.service";
import * as moment from "jalali-moment";
import {
  ComplexFormDataDto,
  deletePostFormData,
  getPostFormDataDto,
  singlePostFormData,
  createCommentFormData,
} from "types";
import { v4 as uuidv4 } from "uuid";
const path = require("path");
const fs = require("fs");

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createComment(formData: createCommentFormData): Promise<{}> {
    const parentId = formData.parentId ? parseInt(formData.parentId) : null;
    let u = {};
    let c = {};
    await this.prisma.$transaction(async (tx) => {
      const comment = await tx.comment.create({
        data: {
          text: formData.text,
          postId: parseInt(formData.postId),
          parentId: parentId,
          date: new Date(),
          userId: parseInt(formData.userId),
        },
      });
      const user = await tx.user.findUnique({
        where: {
          id: parseInt(formData.userId),
        },
        select: {
          firstName: true,
          lastName: true,
        },
      });
      (u = user), (c = comment);
    });
    return {
      user: u,
      ...c,
    };
  }

  async getSinglePost(formData: singlePostFormData): Promise<{}> {
    const post = await this.prisma.post.findUnique({
      where: {
        id: parseInt(formData.postId),
      },
      include: {
        videos: {
          include: {
            audios: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            text: true,
            parentId: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        favorites: {},
        images: {},
        likes: {},
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            likes: true,
            llikes: true,
          },
        },
      },
    });
    return post;
  }

  async getAllPosts(): Promise<{}> {
    const posts = this.prisma.post.findMany();
    return posts;
  }

  async createPost(formData: ComplexFormDataDto): Promise<string> {
    try {
      const result = await this.createPostWithRelatedData(formData);
      if (result === "success") {
        return "success";
      } else if (result === "fail") {
        return "fail";
      }
    } catch (err) {
      return err;
    }

    return null;
  }

  async deletePost(formData: deletePostFormData): Promise<{}> {
    console.log(parseInt(formData.postId));
    try {
      const post = await this.prisma.post.delete({
        where: {
          id: parseInt(formData.postId),
        },
        include: {
          videos: {},
          images: {},
          comments: {},
          favorites: {},
          likes: {},
        },
      });
      console.log(post);
      return post;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getPost(formData: getPostFormDataDto): Promise<{}[]> {
    console.log(formData);
    const where: any = {}; // Initialize the where condition

    if (formData.postId) {
      where.id = parseInt(formData.postId);
    }

    if (formData.userId) {
      where.userId = parseInt(formData.userId);
    }

    if (formData.categories) {
      where.category = {
        in: formData.categories, // Use the 'in' filter
      };
    }

    if (formData.filterFromDate && formData.filterToDate) {
      // Assuming filterFromDate and filterToDate are Date objects
      where.date = {
        gte: formData.filterFromDate,
        lte: formData.filterToDate,
      };
    }

    if (formData.searchTerm) {
      where.title = {
        contains: formData.searchTerm,
      };
    }

    const orderBy: any[] = []; // Initialize the orderBy array

    if (formData.orderBy === "oldest") {
      orderBy.push({ date: "asc" });
    } else if (formData.orderBy === "newest") {
      orderBy.push({ date: "desc" });
    } else if (formData.orderBy === "mostPopular") {
      orderBy.push({ score: "desc" });
    }

    // If formData has no properties, return all posts
    if (Object.keys(formData).length === 0) {
      return await this.prisma.post.findMany();
    }

    const condition = {
      where,
      orderBy,
    };

    if (formData.withVideos) {
      condition["include"] = {
        videos: {
          include: {
            audios: {},
          },
        },
      };
    }

    if (formData.withImages) {
      condition["include"] = {
        ...condition["include"],
        images: {},
      };
    }

    console.log(condition);

    const posts = await this.prisma.post.findMany(condition);

    // Process the posts as needed

    return posts; // Return your desired response
  }

  // Helper function to save files
  async saveFileBuffer(
    file: Express.Multer.File,
    filename: string
  ): Promise<{}> {
    // Implement your file saving logic here (e.g., using fs.promises.writeFile)
    // Define the directory path
    const dirPath = path.join("public", "uploads");

    // Create the directory if it doesn't exist
    fs.mkdirSync(dirPath, { recursive: true });

    // Define the file path
    const filePath = path.join(dirPath, filename);

    // Write the file to the images folder
    fs.writeFileSync(filePath, file.buffer);
    return {
      savedPath: filePath,
    };
  }

  async createPostWithRelatedData(
    formData: ComplexFormDataDto
  ): Promise<string> {
    try {
      console.log(parseInt(formData.userid));
      // Start a transaction
      await this.prisma.$transaction(async (tx) => {
        // Create the Post
        const newPost = await tx.post.create({
          data: {
            title: formData.title,
            content: formData.content,
            category: formData.category,
            jalaliDate: moment().locale("fa").format("YYYY/M/D"),
            date: new Date(),
            score: 0,
            userId: parseInt(formData.userid),
          },
        });

        // Create Images (if available)
        if (formData.images) {
          await Promise.all(
            formData.images.map(async (image) => {
              const extnameImageFile = path.extname(image["originalName"]);
              const originalNameImage = image["originalName"];
              const uniqueFileNameImage = `${uuidv4()}---${originalNameImage}`;

              await this.saveFileBuffer(image, uniqueFileNameImage);
              await tx.image.create({
                data: {
                  url: uniqueFileNameImage,
                  postId: newPost.id,
                },
              });
            })
          );
        }

        // Create Videos (if available)
        if (formData.videos) {
          await Promise.all(
            formData.videos.map(async (video) => {
              const extnameVideoFile = path.extname(video.file["originalName"]);
              const originalNameVideo = video.file["originalName"];
              const uniqueFileNameVideo = `${uuidv4()}---${originalNameVideo}`;
              await this.saveFileBuffer(video.file, `${uniqueFileNameVideo}`);

              const newVideo = await tx.video.create({
                data: {
                  url: uniqueFileNameVideo,
                  postId: newPost.id,
                },
              });

              // Create Audios (if available)
              if (video.audios) {
                await Promise.all(
                  video.audios.map(async (audio) => {
                    const originalNameAudio = audio["originalName"];
                    const uniqueFileNameVideo = `${uuidv4()}---${originalNameAudio}`;
                    await this.saveFileBuffer(audio, `${uniqueFileNameVideo}`);

                    await tx.audio.create({
                      data: {
                        url: uniqueFileNameVideo,
                        videoId: newVideo.id,
                      },
                    });
                  })
                );
              }
            })
          );
        }
      });
      console.log("Post and related data created successfully!");
      return "success";
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      await this.prisma.$disconnect();
      return "fail";
    }
  }
}
