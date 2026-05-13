"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const create_lead_dto_1 = require("./dto/create-lead.dto");
const login_dto_1 = require("./dto/login.dto");
let TenantsController = class TenantsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTenants() {
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
    async getTenant(slug) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { slug },
            include: {
                pages: {
                    take: 1,
                },
            },
        });
        if (!tenant) {
            throw new common_1.NotFoundException(`Tenant with slug ${slug} not found`);
        }
        return tenant;
    }
    async updateTenant(slug, updateData) {
        const tenant = await this.prisma.tenant.findUnique({ where: { slug } });
        if (!tenant)
            throw new common_1.NotFoundException(`Tenant with slug ${slug} not found`);
        return this.prisma.tenant.update({
            where: { slug },
            data: updateData,
        });
    }
    async updateTenantPage(slug, updateData) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { slug },
            include: { pages: { take: 1 } },
        });
        if (!tenant)
            throw new common_1.NotFoundException(`Tenant with slug ${slug} not found`);
        const page = tenant.pages[0];
        if (!page)
            throw new common_1.NotFoundException(`No page found for tenant ${slug}`);
        return this.prisma.page.update({
            where: { id: page.id },
            data: updateData,
        });
    }
    async createLead(slug, leadData) {
        const tenant = await this.prisma.tenant.findUnique({ where: { slug } });
        if (!tenant)
            throw new common_1.NotFoundException(`Tenant with slug ${slug} not found`);
        return this.prisma.lead.create({
            data: {
                ...leadData,
                tenantId: tenant.id,
            },
        });
    }
    async getLeads(slug) {
        const tenant = await this.prisma.tenant.findUnique({ where: { slug } });
        if (!tenant)
            throw new common_1.NotFoundException(`Tenant with slug ${slug} not found`);
        return this.prisma.lead.findMany({
            where: { tenantId: tenant.id },
            orderBy: { createdAt: 'desc' },
        });
    }
    async login(slug, body) {
        const { email, passwordHash } = body;
        const tenant = await this.prisma.tenant.findUnique({ where: { slug } });
        if (!tenant)
            throw new common_1.UnauthorizedException('Invalid tenant');
        const admin = await this.prisma.admin.findUnique({
            where: { email },
        });
        if (!admin || admin.tenantId !== tenant.id) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(passwordHash, admin.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return {
            success: true,
            token: 'mock-jwt-token-' + admin.id,
            admin: { email: admin.email }
        };
    }
    async deleteLead(slug, id) {
        const tenant = await this.prisma.tenant.findUnique({ where: { slug } });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        return this.prisma.lead.delete({
            where: { id, tenantId: tenant.id }
        });
    }
};
exports.TenantsController = TenantsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "getTenants", null);
__decorate([
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "getTenant", null);
__decorate([
    (0, common_1.Put)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "updateTenant", null);
__decorate([
    (0, common_1.Put)(':slug/page'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "updateTenantPage", null);
__decorate([
    (0, common_1.Post)(':slug/leads'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_lead_dto_1.CreateLeadDto]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "createLead", null);
__decorate([
    (0, common_1.Get)(':slug/leads'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "getLeads", null);
__decorate([
    (0, common_1.Post)(':slug/auth/login'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "login", null);
__decorate([
    (0, common_1.Post)(':slug/leads/:id/delete'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "deleteLead", null);
exports.TenantsController = TenantsController = __decorate([
    (0, common_1.Controller)('api/tenants'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantsController);
//# sourceMappingURL=tenants.controller.js.map