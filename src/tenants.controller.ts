import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('api/tenants')
export class TenantsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getTenants() {
    // Only return safe public data needed for the directory
    return this.prisma.tenant.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        primaryColor: true,
        secondaryColor: true,
        logoUrl: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

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

  @Put(':slug')
  async updateTenant(
    @Param('slug') slug: string,
    @Body()
    updateData: {
      name?: string;
      slug?: string;
      primaryColor?: string;
      secondaryColor?: string;
      logoUrl?: string | null;
    },
  ) {
    const tenant = await this.prisma.tenant.findUnique({ where: { slug } });
    if (!tenant)
      throw new NotFoundException(`Tenant with slug ${slug} not found`);

    return this.prisma.tenant.update({
      where: { slug },
      data: updateData,
    });
  }

  @Put(':slug/page')
  async updateTenantPage(
    @Param('slug') slug: string,
    @Body() updateData: { title?: string; content?: any },
  ) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
      include: { pages: { take: 1 } },
    });
    if (!tenant)
      throw new NotFoundException(`Tenant with slug ${slug} not found`);

    const page = tenant.pages[0];
    if (!page) throw new NotFoundException(`No page found for tenant ${slug}`);

    return this.prisma.page.update({
      where: { id: page.id },
      data: updateData,
    });
  }
}
