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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Cleaning existing data...');
    await prisma.lead.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.page.deleteMany({});
    await prisma.tenant.deleteMany({});
    const passwordHash = await bcrypt.hash('admin123', 10);
    console.log('Seeding St. Joseph Amity...');
    const stJoseph = await prisma.tenant.create({
        data: {
            name: 'St. Joseph Amity',
            slug: 'st-joseph',
            primaryColor: '#1e3a8a',
            secondaryColor: '#f59e0b',
            pages: {
                create: {
                    title: 'Luxury Living Reimagined',
                    content: {
                        sections: [
                            {
                                type: 'hero',
                                title: 'St. Joseph Amity',
                                subtitle: 'The Gold Standard of Modern Living. Luxury Condominiums Designed for the Discrete.',
                                backgroundImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop',
                            },
                            {
                                type: 'feature-grid',
                                title: 'Exclusive Amenities',
                                features: [
                                    { title: 'Concierge 24/7', description: 'Personalized assistance for your every need, anytime.' },
                                    { title: 'Sky Lounge Pool', description: 'Infinity pool with panoramic views of the city skyline.' },
                                    { title: 'Private Cinema', description: 'State-of-the-art screening room for residents and guests.' }
                                ],
                            },
                            {
                                type: 'lead-form',
                                title: 'Request a Private Viewing',
                                description: 'Join the waitlist for our exclusive grand opening event.',
                            }
                        ],
                    },
                },
            },
        },
    });
    await prisma.admin.create({
        data: {
            email: 'admin@st-joseph.com',
            passwordHash,
            tenantId: stJoseph.id,
        }
    });
    console.log('Seeding Starblue Aggregates...');
    const starblue = await prisma.tenant.create({
        data: {
            name: 'Starblue Aggregates',
            slug: 'starblue',
            primaryColor: '#0f172a',
            secondaryColor: '#3b82f6',
            pages: {
                create: {
                    title: 'Foundation of the Future',
                    content: {
                        sections: [
                            {
                                type: 'hero',
                                title: 'Starblue Aggregates',
                                subtitle: 'Sourcing the Stronger Materials for the World Builders.',
                                backgroundImage: 'https://images.unsplash.com/photo-1574067765222-3860bb7995a9?q=80&w=2070&auto=format&fit=crop',
                            },
                            {
                                type: 'feature-grid',
                                title: 'Our Raw Power',
                                features: [
                                    { title: 'Industrial Grade', description: 'High-density aggregates for structural integrity.' },
                                    { title: 'Scalable Supply', description: 'From local builds to nation-wide infrastructure projects.' },
                                    { title: 'Sustainable Mining', description: 'Eco-conscious extraction and reclamation practices.' }
                                ],
                            },
                            {
                                type: 'lead-form',
                                title: 'Get a Bulk Quote',
                                description: 'Talk to our logistics experts about your next major build.',
                            }
                        ],
                    },
                },
            },
        },
    });
    await prisma.admin.create({
        data: {
            email: 'admin@starblue.com',
            passwordHash,
            tenantId: starblue.id,
        }
    });
    console.log('Seeding finished successfully.');
    console.log({ stJoseph: stJoseph.name, starblue: starblue.name });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map