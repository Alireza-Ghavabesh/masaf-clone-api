import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaService } from "src/prisma/prisma.service";
import { MailService } from "src/mail/mail.service";
import { AppService } from "src/app.service";
import { ConfigService } from "@nestjs/config";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    MailService,
    AppService,
    ConfigService,
  ],
})
export class AuthModule {}
