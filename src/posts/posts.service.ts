import { Injectable } from "@nestjs/common";
import { PrismaService } from "./../prisma/prisma.service";
import * as moment from "jalali-moment";
import {
  ComplexFormDataDto,
  deletePostFormData,
  getPostFormDataDto,
  singlePostFormData,
  createCommentFormData,
  updateCommentFormData,
  deleteCommentFormData,
  toggleCommentLikeFormData,
  addToFavoriteFormDataDto,
  removeFromFavoriteFormDataDto,
  updateTopSiteBannerFormData,
  updateBottomLeftSiteBannerFormData,
  updateMidSiteBannerFormData, updateBottomRightSiteBannerFormData, ConditionType,
  getPostsByCursorFormData
} from "types";
import { v4 as uuidv4 } from "uuid";
import * as path from 'path';
import * as fs from 'fs';


// const where: any = {}; // Initialize the where condition

// if (formData.postId) {
//   where.id = parseInt(formData.postId);
// }

// if (formData.postId) {
//   where.id = parseInt(formData.postId);
// }

// if (formData.userId) {
//   where.userId = parseInt(formData.userId);
// }

// if (formData.categories) {
//   where.category = {
//     in: formData.categories, // Use the 'in' filter
//   };
// }

// if (formData.filterFromDate && formData.filterToDate) {
//   // Assuming filterFromDate and filterToDate are Date objects
//   where.date = {
//     gte: formData.filterFromDate,
//     lte: formData.filterToDate,
//   };
// }


// const orderBy: any[] = []; // Initialize the orderBy array

// if (formData.orderBy === "oldest") {
//   orderBy.push({ date: "asc" });
// } else if (formData.orderBy === "newest") {
//   orderBy.push({ date: "desc" });
// } else if (formData.orderBy === "mostPopular") {
//   orderBy.push({ score: "desc" });
// }

// // If formData has no properties, return all posts
// if (Object.keys(formData).length === 0) {
//   return await this.prisma.post.findMany();
// }

// const condition: ConditionType = {
//   where,
//   orderBy,
// };


// if (formData.limit) {
//   condition.take = parseInt(formData.limit);
// }



@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) { }

  async getPostsByCursor(
    formData: getPostsByCursorFormData
  ): Promise<any[]> {
    console.log(`-----------------`);
    console.log(formData);
    console.log(`----------------`);
    const where: any = {}; // Initialize the where condition

    const orderBy: any[] = []; // Initialize the orderBy array

    let condition: any = {};

    if (formData.orderBy === "oldest") {
      orderBy.push({ date: "asc" });
    } else if (formData.orderBy === "newest") {
      orderBy.push({ date: "desc" });
    } else if (formData.orderBy === "mostPopular") {
      orderBy.push({ score: "asc" });
    }

    if (formData.cursor) {
      if (formData.orderBy === "newest") {
        where.id = { lt: Number(formData.cursor) };
      } else {
        where.id = { gt: Number(formData.cursor) };
      }
    }

    // Combine conditions using AND logic
    where.AND = [];

    if (formData.category) {
      where.AND.push({ category: formData.category });
    }

    if (formData.searchTerm) {
      where.AND.push({
        title: {
          contains: formData.searchTerm,
        },
      });
    }

    if (formData.tags && formData.tags.length > 0) {
      formData.tags.forEach((tag) => {
        where.AND.push({
          tags: {
            some: {
              tag: {
                name: tag,
              },
            },
          },
        });
      });
    }

    if (formData.limit) {
      condition.take = parseInt(formData.limit);
    }

    if (formData.filterFromDate && formData.filterToDate) {
      // Assuming filterFromDate and filterToDate are Date objects
      where.AND.push({
        date: {
          gte: formData.filterFromDate,
          lte: formData.filterToDate,
        },
      });
    }

    if(formData.userId) {
      where.AND.push({
        userId: formData.userId
      })
    }
    

    condition.where = where;
    condition.orderBy = orderBy;

    const posts = await this.prisma.post.findMany(condition);
    console.log(`<=========response==========`);
    console.log(posts);
    console.log(`==========response==========>`);
    console.log('\n\n\n');

    return posts;
  }









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
          id: true,
          firstName: true,
          lastName: true,
        },
      });
      (u = user), (c = comment);
    });

    return {
      ...c,
      user: u,
      likeCount: 0,
      likedByMe: false,
    };
  }

  async updateComment(formData: updateCommentFormData): Promise<{}> {
    let cmnt = {};
    await this.prisma.$transaction(async (tx) => {
      const { userId } = await tx.comment.findUnique({
        where: {
          id: parseInt(formData.commentId),
        },
        select: {
          userId: true,
        },
      });

      if (userId !== parseInt(formData.userId)) {
        return {
          message: "You do not have permission to edit this comment",
          status: "badPremission",
        };
      }

      const comment = await tx.comment.update({
        where: { id: parseInt(formData.commentId) },
        data: { text: formData.text },
        select: { text: true },
      });
      cmnt = comment;
    });
    return cmnt;
  }

  async deleteComment(formData: deleteCommentFormData): Promise<{}> {
    let cmnt = {};
    await this.prisma.$transaction(async (tx) => {
      const { userId } = await tx.comment.findUnique({
        where: {
          id: parseInt(formData.commentId),
        },
        select: {
          userId: true,
        },
      });

      if (userId !== parseInt(formData.userId)) {
        return {
          message: "You do not have permission to delete this comment",
          status: "badPremission",
        };
      }

      const comment = await tx.comment.delete({
        where: { id: parseInt(formData.commentId) },
        select: { id: true },
      });
      cmnt = comment;
    });
    return cmnt;
  }

  async toggleCommentLike(formData: toggleCommentLikeFormData): Promise<{}> {
    let result = {};
    let userId: number;
    if (formData.userId === 'undefined') {
      userId = 0
    } else {
      userId = parseInt(formData.userId)
    }
    const data = {
      userId: userId,
      commentId: parseInt(formData.commentId),
    };

    await this.prisma.$transaction(async (tx) => {
      const commentLike = await tx.lLike.findUnique({
        where: {
          userId_commentId: data,
        },
      });

      if (commentLike == null) {
        await tx.lLike.create({ data: data });
        result = {
          addLike: true,
        };
      } else {
        await tx.lLike.delete({
          where: {
            userId_commentId: data,
          },
        });
        result = {
          addLike: false,
        };
      }
    });
    return result;
  }

  async getSinglePost(formData: singlePostFormData): Promise<{}> {
    let userId: number;
    if (formData.userId === "undefined") {
      userId = 0;
    } else {
      userId = parseInt(formData.userId);
    }

    let postWithLikesAndComments = {};
    await this.prisma.$transaction(async (tx) => {
      const post = await tx.post.findUnique({
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
              _count: {
                select: {
                  Llike: true,
                },
              },
            },
          },
          favorites: {
            where: {
              postId: parseInt(formData.postId),
              userId: parseInt(formData.userId)
            }
          },
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

      const commentLikes = await tx.lLike.findMany({
        where: {
          userId: userId,
          commentId: {
            in: post.comments.map((comment) => comment.id),
          },
        },
      });

      postWithLikesAndComments = {
        ...post,
        comments: post.comments.map((comment) => {
          const { _count, ...commentFields } = comment;
          return {
            ...commentFields,
            likedByMe: commentLikes.find(
              (commentLike) => commentLike.commentId === comment.id
            ),
            likeCount: _count.Llike,
          };
        }),
      };
    });

    return postWithLikesAndComments;
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


    const where: any = {}; // Initialize the where condition

    if (formData.postId) {
      where.id = parseInt(formData.postId);
    }

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

    const condition: ConditionType = {
      where,
      orderBy,
    };


    if (formData.limit) {
      condition.take = parseInt(formData.limit);
    }

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





    const posts = await this.prisma.post.findMany(condition);

    // Process the posts as needed

    console.log(posts)

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

      // Start a transaction
      await this.prisma.$transaction(async (tx) => {




        let uniqueFileNamePostThumbnail = 'default-post-thumbnail.jpg';

        if (formData.postThumbnail["originalName"]) {
          const extnameImageFile = path.extname(formData.postThumbnail["originalName"]);
          const originalNameImage = formData.postThumbnail["originalName"];
          uniqueFileNamePostThumbnail = `${uuidv4()}---${originalNameImage}`;
          console.log(`uniqueFileNamePostThumbnail:${uniqueFileNamePostThumbnail}`);
          await this.saveFileBuffer(formData.postThumbnail, uniqueFileNamePostThumbnail);
        }

        // Create the Post
        const newPost = await tx.post.create({
          data: {
            postThumbnail: uniqueFileNamePostThumbnail,
            title: formData.title,
            content: formData.content,
            category: formData.category,
            jalaliDate: moment().locale("fa").format("YYYY/M/D"),
            date: new Date(),
            score: 0,
            userId: parseInt(formData.userid),
          },
        });

        if (formData.tags) {
          await Promise.all(
            formData.tags.map(async (tag) => {
              // Create the tag
              const newTag = await tx.tag.create({
                data: {
                  name: tag,
                },
              });

              // Link the tag to the post in the PostTag table
              await tx.postTag.create({
                data: {
                  postId: newPost.id,
                  tagId: newTag.id,
                },
              });
            })
          );
        }




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
              if (video.file as any === 'null' || video.file === undefined) {
                return
              }

              let uniqueFileNameThumbnail = 'default-post-thumbnail.jpg';
              if (video.thumbnail["originalName"]) {
                const originalNameThumbnail = video.thumbnail["originalName"];
                uniqueFileNameThumbnail = `${uuidv4()}---${originalNameThumbnail}`;
                await this.saveFileBuffer(video.thumbnail, `${uniqueFileNameThumbnail}`);
              }



              const originalNameVideo = video.file["originalName"];
              const uniqueFileNameVideo = `${uuidv4()}---${originalNameVideo}`;
              await this.saveFileBuffer(video.file, `${uniqueFileNameVideo}`);



              const newVideo = await tx.video.create({
                data: {
                  thumbnail: uniqueFileNameThumbnail,
                  url: uniqueFileNameVideo,
                  postId: newPost.id,
                },
              });


              // Create Audios (if available)
              if (video.audios) {
                await Promise.all(
                  video.audios.map(async (audio) => {

                    const originalNameAudio = audio["originalName"];
                    const key = uuidv4();
                    const uniqueFileNameVideo = `${key}---${originalNameAudio}`;
                    await this.saveFileBuffer(audio, `${uniqueFileNameVideo}`);

                    await tx.audio.create({
                      data: {
                        videoId: newVideo.id,
                        url: uniqueFileNameVideo,
                        key: key,
                      },
                    });
                  })
                );
              }
            })
          );
        } else {
          console.log("no videos")
          return
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

  async addToFavorite(formData: addToFavoriteFormDataDto): Promise<{
    id: number,
    userId: number,
    postId: number,
    result: string
  }> {
    try {
      const { postId, userId } = formData;
      const parsedPostId = parseInt(postId);
      const parsedUserId = parseInt(userId);

      const result = await this.prisma.$transaction(async (prisma) => {
        // Check if the favorite record exists
        const existingFavorite = await prisma.favorite.findFirst({
          where: {
            postId: parsedPostId,
            userId: parsedUserId,
          },
        });

        if (existingFavorite) {
          // Remove the existing favorite
          await prisma.favorite.deleteMany({
            where: {
              postId: parsedPostId,
              userId: parsedUserId,
            },
          });
          return {
            id: existingFavorite.id,
            userId: existingFavorite.userId,
            postId: existingFavorite.postId,
            result: "removed from favorites"
          };
        } else {
          // Add a new favorite
          const newFavorite = await prisma.favorite.create({
            data: {
              postId: parsedPostId,
              userId: parsedUserId,
            },
          });
          return {
            id: newFavorite.id,
            userId: newFavorite.userId,
            postId: newFavorite.postId,
            result: "added to favorites"
          };
        }
      });

      return result;
    } catch (err) {
      throw new Error('Failed to add or remove favorite');
    }
  }

  async removeFromFavorite(formData: removeFromFavoriteFormDataDto): Promise<{
    id: number,
    userId: number,
    postId: number,
  }> {
    try {
      const favorite = await this.prisma.favorite.deleteMany({
        where: {
          postId: parseInt(formData.postId),
          userId: parseInt(formData.userId),
        }
      })
      return {
        id: favorite[0].id,
        userId: favorite[0].userId,
        postId: favorite[0].postId,
      }
    } catch (err) {
      return err
    }
  }

  async updateTopSiteBannerUrl(formData: updateTopSiteBannerFormData): Promise<{}> {
    const originalNameImage = formData.topSiteBanner["originalName"];
    const uniqueFileNameImage = `${uuidv4()}---${originalNameImage}`;
    await this.saveFileBuffer(formData.topSiteBanner, uniqueFileNameImage);

    const topSiteBannerUrl = await this.prisma.siteContent.upsert({
      where: {
        id: 1
      },
      update: {
        bannerUrl: uniqueFileNameImage
      },
      create: {
        // Make sure to include all required fields for the create input
        bannerUrl: uniqueFileNameImage,
        smallBannerLeftUrl: "", // Replace with actual value or variable
        smallBannerMidUrl: "", // Replace with actual value or variable
        smallBannerRighttUrl: "", // Replace with actual value or variable
        footerBannerUrl: "",
      }
    });

    return {
      topSiteBannerUrl: topSiteBannerUrl
    };
  }

  async updateBottomLeftSiteBannerUrl(formData: updateBottomLeftSiteBannerFormData): Promise<{}> {
    const originalNameImage = formData.bottomLeftSiteBanner["originalName"];
    const uniqueFileNameImage = `${uuidv4()}---${originalNameImage}`;
    await this.saveFileBuffer(formData.bottomLeftSiteBanner, uniqueFileNameImage);


    const bottomLeftSiteBannerUrl = await this.prisma.siteContent.upsert({
      where: {
        id: 1
      },
      update: {
        smallBannerLeftUrl: uniqueFileNameImage
      },
      create: {
        // Make sure to include all required fields for the create input
        bannerUrl: "",
        smallBannerLeftUrl: uniqueFileNameImage, // Replace with actual value or variable
        smallBannerMidUrl: "", // Replace with actual value or variable
        smallBannerRighttUrl: "", // Replace with actual value or variable
        footerBannerUrl: "",
      }
    });

    console.log(bottomLeftSiteBannerUrl)

    return {
      bottomLeftSiteBannerUrl: bottomLeftSiteBannerUrl
    };
  }

  async updateMidSiteBannerUrl(formData: updateMidSiteBannerFormData): Promise<{}> {
    const originalNameImage = formData.midSiteBanner["originalName"];
    const uniqueFileNameImage = `${uuidv4()}---${originalNameImage}`;
    await this.saveFileBuffer(formData.midSiteBanner, uniqueFileNameImage);


    const midSiteBannerUrl = await this.prisma.siteContent.upsert({
      where: {
        id: 1
      },
      update: {
        smallBannerMidUrl: uniqueFileNameImage
      },
      create: {
        // Make sure to include all required fields for the create input
        bannerUrl: "",
        smallBannerLeftUrl: "", // Replace with actual value or variable
        smallBannerMidUrl: uniqueFileNameImage, // Replace with actual value or variable
        smallBannerRighttUrl: "", // Replace with actual value or variable
        footerBannerUrl: "",
      }
    });

    console.log(midSiteBannerUrl)

    return {
      midSiteBannerUrl: midSiteBannerUrl
    };
  }

  async updateBottomRightSiteBannerUrl(formData: updateBottomRightSiteBannerFormData): Promise<{}> {
    const originalNameImage = formData.bottomRightSiteBanner["originalName"];
    const uniqueFileNameImage = `${uuidv4()}---${originalNameImage}`;
    await this.saveFileBuffer(formData.bottomRightSiteBanner, uniqueFileNameImage);


    const bottomRightSiteBannerUrl = await this.prisma.siteContent.upsert({
      where: {
        id: 1
      },
      update: {
        smallBannerRighttUrl: uniqueFileNameImage
      },
      create: {
        // Make sure to include all required fields for the create input
        bannerUrl: "",
        smallBannerLeftUrl: "", // Replace with actual value or variable
        smallBannerMidUrl: "", // Replace with actual value or variable
        smallBannerRighttUrl: uniqueFileNameImage, // Replace with actual value or variable
        footerBannerUrl: "",
      }
    });

    console.log(bottomRightSiteBannerUrl)

    return {
      bottomRightSiteBannerUrl: bottomRightSiteBannerUrl
    };
  }

}
