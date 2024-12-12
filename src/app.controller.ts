import { Controller, Get, Param, Req, Res } from "@nestjs/common";
import { Response } from 'express';
import { AppService } from "./app.service";
import { Request } from "express";
import * as path from "path";
import * as fs from "fs";



@Controller("stream")
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("video/:filename")
  async streamVideo(@Param("filename") filename: string, @Req() req: Request, @Res() res: Response) {
    console.log("we got request")
    const range = req.headers.range;
    if (!range) {
      res.status(400).send("Requires Range header");
      return;
    }

    const flname = `${filename}.mp4`;

    const videoPath = path.join(process.cwd(), "public", "uploads", flname);
    const videoSize = fs.statSync(videoPath).size;

    const CHUNK_SIZE = 200 * 1024; // 200 KB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers); 

    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
  }

  @Get("audio/:filename")
  async streamAudio(@Param("filename") filename: string, @Req() req: Request, @Res() res: Response) {
      const flname = `${filename}.mp3`;
      console.log(`flname:${flname}`)

      const audioPath = path.join(process.cwd(), "public", "uploads", flname);
      console.log(`Requested file: ${filename}`);
      console.log(`Resolved path: ${audioPath}`);
  
      if (!fs.existsSync(audioPath)) {
          res.status(404).send('File not found');
          return;
      }
  
      const stat = fs.statSync(audioPath);
      const fileSize = stat.size;
      const range = req.headers.range;
  
      if (range) {
          const parts = range.replace(/bytes=/, "").split("-");
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + 200 * 1024 - 1, fileSize - 1);
  
          if (start >= fileSize) {
              res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
              return;
          }
  
          const chunksize = (end - start) + 1;
          const file = fs.createReadStream(audioPath, { start, end });
          const head = {
              'Content-Range': `bytes ${start}-${end}/${fileSize}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunksize,
              'Content-Type': 'audio/mpeg',
          };
  
          res.writeHead(206, head);
          file.pipe(res);
      } else {
          const head = {
              'Content-Length': fileSize,
              'Content-Type': 'audio/mpeg',
          };
          res.writeHead(200, head);
          fs.createReadStream(audioPath).pipe(res);
      }
  }


  @Get("thumbnail/:filename")
  async sendThumbnail(@Param("filename") filename: string, @Req() req: Request, @Res() res: Response) {
    console.log(filename)
    const thumbnailPath = path.join(process.cwd(), 'public', 'uploads', filename);

    res.sendFile(thumbnailPath, (err) => {
      if (err) {
        res.status(404).send('File not found');
      }
    });
  }

  @Get("gallery/:filename")
  async sendImage(@Param("filename") filename: string, @Req() req: Request, @Res() res: Response) {
    console.log(filename)
    const image = path.join(process.cwd(), 'public', 'uploads', filename);

    res.sendFile(image, (err) => {
      if (err) {
        res.status(404).send('File not found');
      }
    });
  }

  @Get("serveSiteBanner")
  async serveSiteBanner(@Res() res: Response) {
    const siteBanner = await this.appService.getSiteBannerImage();
    const bannerPath= path.join(process.cwd(), 'public', 'uploads', siteBanner);
    console.log(bannerPath)
    res.sendFile(bannerPath)
  }

  @Get("serveBottomLeftSiteBanner")
  async serveBottomLeftSiteBanner(@Res() res: Response) {
    const bottomLeftsiteBanner = await this.appService.getBottomLeftSiteBannerImage();
    const bottomLeftbannerPath= path.join(process.cwd(), 'public', 'uploads', bottomLeftsiteBanner);
    console.log(bottomLeftbannerPath)
    res.sendFile(bottomLeftbannerPath)
  }

  @Get("serveMidSiteBanner")
  async serveMidSiteBanner(@Res() res: Response) {
    const midsiteBanner = await this.appService.getMidSiteBannerImage();
    const midbannerPath= path.join(process.cwd(), 'public', 'uploads', midsiteBanner);
    console.log(midbannerPath)
    res.sendFile(midbannerPath)
  }

  @Get("serveBottomRightSiteBanner")
  async serveBottomRightSiteBanner(@Res() res: Response) {
    const bottomRightsiteBanner = await this.appService.getBottomRightSiteBannerImage();
    const bottomRightbannerPath= path.join(process.cwd(), 'public', 'uploads', bottomRightsiteBanner);
    console.log(bottomRightbannerPath)
    res.sendFile(bottomRightbannerPath)
  }
  
}
