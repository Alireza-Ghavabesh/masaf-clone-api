import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Load environment variables based on the NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.NEXT_PUBLIC_HTTP_DOMAIN_ADDRESS, // Use environment variables
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify the allowed methods
    credentials: true, // This is important for sessions or basic auth
  });
  await app.listen(8000);
}

bootstrap();
