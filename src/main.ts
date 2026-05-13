import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Security Headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images from other sources
  }));
  
  // Refined CORS for Multi-Tenancy
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server, curl)
      if (!origin) {
        callback(null, true);
        return;
      }
      // Allow localhost in development
      if (origin.includes('localhost')) {
        callback(null, true);
        return;
      }
      // Allow the explicit frontend URL (e.g. your Vercel deployment URL)
      const frontendUrl = process.env.FRONTEND_URL;
      if (frontendUrl && origin === frontendUrl) {
        callback(null, true);
        return;
      }
      // Allow any origin ending with ROOT_DOMAIN (e.g. ".vercel.app" for all Vercel previews)
      const rootDomain = process.env.ROOT_DOMAIN;
      if (rootDomain && origin.endsWith(rootDomain)) {
        callback(null, true);
        return;
      }
      // Reject unknown origins but log them for easier debugging
      console.warn(`[CORS] Blocked origin: ${origin}`);
      callback(null, false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useStaticAssets(join(process.cwd(), 'public'));
  
  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`Backend is running on: http://localhost:${port}`);
}
bootstrap();
