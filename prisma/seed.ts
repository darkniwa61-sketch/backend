import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Clear existing data to avoid conflicts
  console.log('Cleaning existing data...');
  await prisma.page.deleteMany({});
  await prisma.tenant.deleteMany({});

  // 2. Seed St. Joseph Amity (Luxury Condominium)
  console.log('Seeding St. Joseph Amity...');
  const stJoseph = await prisma.tenant.create({
    data: {
      name: 'St. Joseph Amity',
      slug: 'st-joseph',
      primaryColor: '#1e3a8a', // Deep Blue
      secondaryColor: '#f59e0b', // Amber/Gold
      pages: {
        create: {
          title: 'Luxury Living Reimagined',
          content: {
            sections: [
              {
                type: 'hero',
                title: 'St. Joseph Amity',
                subtitle: 'The Gold Standard of Modern Living. Luxury Condominiums Designed for the Discrete.',
                backgroundImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop', // Luxury Condo Render
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

  // 3. Seed Starblue Aggregates (Industrial Quarry)
  console.log('Seeding Starblue Aggregates...');
  const starblue = await prisma.tenant.create({
    data: {
      name: 'Starblue Aggregates',
      slug: 'starblue',
      primaryColor: '#0f172a', // Slate 900
      secondaryColor: '#3b82f6', // Bright Blue
      pages: {
        create: {
          title: 'Foundation of the Future',
          content: {
            sections: [
              {
                type: 'hero',
                title: 'Starblue Aggregates',
                subtitle: 'Sourcing the Stronger Materials for the World Builders.',
                backgroundImage: 'https://images.unsplash.com/photo-1574067765222-3860bb7995a9?q=80&w=2070&auto=format&fit=crop', // Industrial Quarry Render
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
