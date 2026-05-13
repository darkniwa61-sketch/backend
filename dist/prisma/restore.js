"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function restore() {
    console.log('Restoring St. Joseph Premium branding...');
    const tenant = await prisma.tenant.findUnique({ where: { slug: 'st-joseph' } });
    if (tenant) {
        await prisma.tenant.update({
            where: { id: tenant.id },
            data: {
                name: 'St. Joseph Amity Prime Development Corp.',
                primaryColor: '#8b5cf6',
                secondaryColor: '#1e1b4b',
                pages: {
                    updateMany: {
                        where: { tenantId: tenant.id },
                        data: {
                            content: {
                                sections: [
                                    {
                                        type: 'hero',
                                        title: 'St. Joseph Amity Prime Development Corp.',
                                        subtitle: 'Where Luxury Meets Legacy. Premium Property Solutions for the Modern Lifestyle.',
                                        ctaText: 'Schedule a Viewing',
                                        backgroundImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
                                    },
                                    {
                                        type: 'projects',
                                        items: [
                                            {
                                                name: 'Jadeville Heights',
                                                status: 'For Sale',
                                                price: '₱4,500,000',
                                                location: 'Premium District, Metro South',
                                                beds: '4',
                                                baths: '3',
                                                sqft: '2,800',
                                                description: 'A modern masterpiece featuring floor-to-ceiling windows and panoramic views.',
                                                image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
                                                bedImages: [
                                                    'https://images.unsplash.com/photo-1540518614846-7eded433c457',
                                                    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0'
                                                ],
                                                bathImages: [
                                                    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a'
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'lead-form',
                                        title: 'Schedule a Viewing',
                                        description: 'Connect with our property experts to find your dream home.',
                                        address: '888 Prime Blvd, Capital City, Metro'
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        });
        console.log('Restoration complete!');
    }
}
restore()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=restore.js.map