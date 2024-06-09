import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma/prisma.service";
import { PostsModule } from "./posts/posts.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { MailService } from "./mail/mail.service";
import { ConfigModule, ConfigService } from "@nestjs/config";


@Module({
  imports: [PostsModule, UsersModule, AuthModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, PrismaService, MailService , ConfigService],
})
export class AppModule {}
