import { PrismaService } from './prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LoginDto } from './dto/login.dto';
export declare class TenantsController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getTenants(): Promise<{
        id: string;
        name: string;
        slug: string;
        primaryColor: string;
        secondaryColor: string;
        logoUrl: string | null;
        contactPhone: string | null;
        contactEmail: string | null;
        socialLinks: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    getTenant(slug: string): Promise<{
        pages: {
            id: string;
            title: string;
            content: import("@prisma/client/runtime/library").JsonValue;
            tenantId: string;
        }[];
    } & {
        id: string;
        name: string;
        slug: string;
        primaryColor: string;
        secondaryColor: string;
        logoUrl: string | null;
        contactPhone: string | null;
        contactEmail: string | null;
        socialLinks: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
    }>;
    updateTenant(slug: string, updateData: {
        name?: string;
        slug?: string;
        primaryColor?: string;
        secondaryColor?: string;
        logoUrl?: string | null;
        contactPhone?: string | null;
        contactEmail?: string | null;
        socialLinks?: any;
    }): Promise<{
        id: string;
        name: string;
        slug: string;
        primaryColor: string;
        secondaryColor: string;
        logoUrl: string | null;
        contactPhone: string | null;
        contactEmail: string | null;
        socialLinks: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
    }>;
    updateTenantPage(slug: string, updateData: {
        title?: string;
        content?: any;
    }): Promise<{
        id: string;
        title: string;
        content: import("@prisma/client/runtime/library").JsonValue;
        tenantId: string;
    }>;
    createLead(slug: string, leadData: CreateLeadDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        tenantId: string;
        email: string;
        interest: string;
        message: string;
        date: string | null;
        time: string | null;
    }>;
    getLeads(slug: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        tenantId: string;
        email: string;
        interest: string;
        message: string;
        date: string | null;
        time: string | null;
    }[]>;
    login(slug: string, body: LoginDto): Promise<{
        success: boolean;
        token: string;
        admin: {
            email: string;
        };
    }>;
    deleteLead(slug: string, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        tenantId: string;
        email: string;
        interest: string;
        message: string;
        date: string | null;
        time: string | null;
    }>;
}
