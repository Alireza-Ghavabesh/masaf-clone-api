import { IsString, IsArray, ValidateNested, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { IsFile } from "nestjs-form-data";

class VideoDto {
  @IsFile()
  file: Express.Multer.File; // Assuming videoFile is a File object

  @IsOptional()
  @IsArray()
  audios: Express.Multer.File[]; // List of audio files
}

export class deletePostFormData {
  @IsString()
  postId: string;
}

export class ComplexFormDataDto {
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
}
