import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Post,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LoginDto } from './dto/login.dto';

@Controller('api/tenants')
export class TenantsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('')
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
        contactPhone: true,
        contactEmail: true,
        socialLinks: true,
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
      contactPhone?: string | null;
      contactEmail?: string | null;
      socialLinks?: any;
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
  
  @Post(':slug/leads')
  async createLead(
    @Param('slug') slug: string,
    @Body() leadData: CreateLeadDto,
  ) {
    const tenant = await this.prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) throw new NotFoundException(`Tenant with slug ${slug} not found`);

    return this.prisma.lead.create({
      data: {
        ...leadData,
        tenantId: tenant.id,
      },
    });
  }

  @Get(':slug/leads')
  async getLeads(@Param('slug') slug: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) throw new NotFoundException(`Tenant with slug ${slug} not found`);

    return this.prisma.lead.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post(':slug/auth/login')
  async login(
    @Param('slug') slug: string,
    @Body() body: LoginDto
  ) {
    const { email, passwordHash } = body;
    
    const tenant = await this.prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) throw new UnauthorizedException('Invalid tenant');

    const admin = await this.prisma.admin.findUnique({ 
      where: { email },
    });

    if (!admin || admin.tenantId !== tenant.id) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(passwordHash, admin.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { 
      success: true, 
      token: 'mock-jwt-token-' + admin.id,
      admin: { email: admin.email }
    };
  }

  @Post(':slug/leads/:id/delete')
  async deleteLead(
    @Param('slug') slug: string,
    @Param('id') id: string
  ) {
    const tenant = await this.prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    return this.prisma.lead.delete({
      where: { id, tenantId: tenant.id }
    });
  }
}
