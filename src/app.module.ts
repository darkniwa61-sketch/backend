import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { TenantsController } from './tenants.controller';

@Module({
  imports: [],
  controllers: [AppController, TenantsController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
