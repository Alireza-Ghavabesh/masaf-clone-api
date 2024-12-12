import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService, private prisma: PrismaService) {}

  getDatabaseURL(): string {
    return this.configService.get<string>('DATABASE_URL');
  }

  getGmailPasswordForSendEmail(): string {
    return this.configService.get<string>('GmailPassword');
  }

  async getAudioFilename(url: string): Promise<string | null> {
    return this.prisma.$transaction(async (tx) => {
      const audio = await tx.audio.findFirst({
        where: {
          url: url
        }
      });
  
      return audio.url;
    });
  }

  async getSiteBannerImage(): Promise<string>{
    const bannerFileName = (await this.prisma.siteContent.findFirst()).bannerUrl;
    return bannerFileName;
  }

  async getBottomLeftSiteBannerImage(): Promise<string>{
    const bottomLeftbannerFileName = (await this.prisma.siteContent.findFirst()).smallBannerLeftUrl;
    return bottomLeftbannerFileName;
  }

  async getMidSiteBannerImage(): Promise<string>{
    const midBannerFileName = (await this.prisma.siteContent.findFirst()).smallBannerMidUrl;
    return midBannerFileName;
  }

  async getBottomRightSiteBannerImage(): Promise<string>{
    const bottomRightbannerFileName = (await this.prisma.siteContent.findFirst()).smallBannerRighttUrl;
    return bottomRightbannerFileName;
  }
}