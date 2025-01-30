import {
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNumber,
} from "class-validator";
import { Type } from "class-transformer";
import { IsFile } from "nestjs-form-data";

class VideoDto {

  @IsOptional()
  @IsFile()
  file?: Express.Multer.File; // Assuming videoFile is a File object

  @IsOptional()
  @IsArray()
  audios?: Express.Multer.File[]; // List of audio files

  @IsFile()
  @IsOptional()
  thumbnail?: Express.Multer.File; // Assuming videoFile is a File object
  
}

export class deletePostFormData {
  @IsString()
  postId: string;
}

export class ComplexFormDataDto {

  @IsString()
  @IsOptional()
  postThumbnail?: Express.Multer.File;

  @IsString()
  userid: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VideoDto)
  videos?: VideoDto[];

  @IsOptional()
  @IsArray()
  images?: Express.Multer.File[]; // List of image files

  @IsOptional()
  @IsArray()
  tags?: string[]; // List of tags
}

export class getPostFormDataDto {
  @IsOptional()
  @IsArray()
  categories: string;

  @IsOptional()
  @IsString()
  orderBy: "newest" | "oldest" | "mostPopular";

  @IsOptional()
  @IsString()
  searchTerm: string;

  @IsOptional()
  @IsString()
  filterFromDate: string;

  @IsOptional()
  @IsString()
  filterToDate: string;

  @IsOptional()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  postId: string;

  @IsOptional()
  @IsString()
  withVideos: string;

  @IsOptional()
  @IsString()
  withImages: string;

  @IsOptional()
  @IsString()
  limit: string;
}

export class singlePostFormData {
  @IsString()
  postId: string;

  @IsString()
  userId: string;
}

export class createCommentFormData {
  @IsString()
  postId: string;

  @IsString()
  @IsOptional()
  parentId: string;

  @IsString()
  text: string;

  @IsString()
  userId: string;
}

export class updateCommentFormData {
  @IsString()
  postId: string;

  @IsString()
  commentId: string;

  @IsString()
  text: string;

  @IsString()
  userId: string;
}

export class deleteCommentFormData {
  @IsString()
  postId: string;

  @IsString()
  commentId: string;

  @IsString()
  userId: string;
}

export class toggleCommentLikeFormData {
  @IsString()
  commentId: string;

  @IsString()
  userId: string;
}


export class addToFavoriteFormDataDto {
  @IsString()
  userId: string;

  @IsString()
  postId: string;
}

export class removeFromFavoriteFormDataDto {
  @IsString()
  userId: string;

  @IsString()
  postId: string;
}

export class updateTopSiteBannerFormData {
  @IsFile()
  topSiteBanner: Express.Multer.File;
}

export class updateBottomLeftSiteBannerFormData {
  @IsFile()
  bottomLeftSiteBanner: Express.Multer.File;
}

export class updateMidSiteBannerFormData {
  @IsFile()
  midSiteBanner: Express.Multer.File;
}

export class updateBottomRightSiteBannerFormData {
  @IsFile()
  bottomRightSiteBanner: Express.Multer.File;
}


export class getPostsByCursorFormData {
  @IsOptional()
  @IsString()
  cursor: string;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  limit: string;

  @IsOptional()
  @IsString()
  orderBy: "newest" | "oldest" | "mostPopular";

  @IsOptional()
  @IsString()
  searchTerm: string;

  @IsOptional()
  @IsString()
  filterFromDate: string;

  @IsOptional()
  @IsString()
  filterToDate: string;
  
  @IsOptional()
  @IsArray()
  tags?: string[]; // List of tags

  @IsOptional()
  @IsString()
  userId: string;
}

export type ConditionType = { where: any; orderBy: any[]; take?: number; include?: any; select?: any };



