import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    // No constructor needed here anymore!
    async onModuleInit() {
        await this.$connect();
    }
}