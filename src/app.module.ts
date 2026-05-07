import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { TenantsController } from './tenants.controller';
import { UploadController } from './upload.controller';

@Module({
  imports: [],
  controllers: [AppController, TenantsController, UploadController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
