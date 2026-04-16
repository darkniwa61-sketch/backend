import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('api/tenants')
export class TenantsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':slug')
  async getTenant(@Param('slug') slug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
      include: {
        pages: {
          take: 1, // Get the primary landing page
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with slug ${slug} not found`);
    }

    return tenant;
  }
}
