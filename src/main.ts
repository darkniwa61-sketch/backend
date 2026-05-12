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
      // Allow localhost in development
      if (!origin || origin.includes('localhost:3000')) {
        callback(null, true);
        return;
      }
      // Allow any subdomain of the root domain if defined
      const rootDomain = process.env.ROOT_DOMAIN;
      if (rootDomain && origin.endsWith(rootDomain)) {
        callback(null, true);
        return;
      }
      // Fallback
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
