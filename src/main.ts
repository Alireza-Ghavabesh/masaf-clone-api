import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Allow only requests from your Next.js app
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify the allowed methods
    credentials: true, // This is important for sessions or basic auth
  });
  await app.listen(8000);
}
bootstrap();
