const PROD_API = 'https://promotional-cms-backend.onrender.com';

async function seedStarblueProduction() {
  console.log('Checking if Starblue tenant exists in production...');

  // 1. Check if tenant exists
  let tenantExists = false;
  let currentSections = [];

  try {
    const res = await fetch(`${PROD_API}/api/tenants/starblue`);
    if (res.ok) {
      const data = await res.json();
      tenantExists = true;
      currentSections = data.pages?.[0]?.content?.sections || [];
      console.log('Tenant found in production. Will update page content only.');
    } else {
      console.log('Tenant NOT found. Will create from scratch.');
    }
  } catch (e) {
    console.log('Could not reach production API:', e.message);
    return;
  }

  // 2. If tenant doesn't exist, we need to POST it first via Prisma directly
  //    Since there's no POST /tenants route, we'll use PUT to update existing.
  //    The tenant must be created via the admin panel or DB migration.
  //    Let's check if there's a create endpoint.

  if (!tenantExists) {
    console.log('\n❌ ERROR: Starblue tenant does not exist in production database.');
    console.log('The backend does not have a POST /api/tenants endpoint.');
    console.log('\n✅ SOLUTION: You need to create the tenant manually in Supabase.');
    console.log('   1. Go to: https://supabase.com/dashboard/project/rzvhnfbeptknktqatfmg');
    console.log('   2. Open the Table Editor → "Tenant" table');
    console.log('   3. Insert a new row with these values:');
    console.log('      - id: (leave blank, auto-generated)');
    console.log('      - name: Starblue Aggregates Inc.');
    console.log('      - slug: starblue');
    console.log('      - primaryColor: #1e3a8a');
    console.log('      - secondaryColor: #3b82f6');
    console.log('      - logoUrl: (leave blank)');
    console.log('      - contactPhone: (your phone)');
    console.log('      - contactEmail: (your email)');
    console.log('\n   4. Then insert a row in the "Page" table linked to that tenant:');
    console.log('      - title: Starblue Home');
    console.log('      - content: {"sections": []}');
    console.log('      - tenantId: (the id from the Tenant row above)');
    console.log('\n   5. Then create an Admin row:');
    console.log('      - email: admin@starblue.com');
    console.log('      - passwordHash: (bcrypt hash of your password)');
    console.log('      - tenantId: (the id from the Tenant row)');
    console.log('\n   After inserting the rows, run this script again to seed the products!');
    return;
  }

  // 3. Seed products
  const products = [
    { name: 'Banday banda', details: 'Premium aggregate mix', price: '₱400 / ton', image: 'https://images.unsplash.com/photo-1517596001157-1dfd374477db?q=80&w=600&auto=format&fit=crop' },
    { name: 'Banlik / Mineral Filler', details: 'Fine mineral filler', price: '₱250 / ton', image: 'https://images.unsplash.com/photo-1616167812845-a7465377f5f2?q=80&w=600&auto=format&fit=crop' },
    { name: 'Topsoil / Backfill', details: 'High-quality soil for filling', price: '₱300 / cubic meter', image: 'https://images.unsplash.com/photo-1581452934177-38e9fc78018e?q=80&w=600&auto=format&fit=crop' },
    { name: 'Weathered Rock', details: 'Durable weathered stone', price: '₱550 / ton', image: 'https://images.unsplash.com/photo-1518338950853-4dc9b8e97491?q=80&w=600&auto=format&fit=crop' },
    { name: 'Blue Sand Vibro', details: 'Specialized blue vibro sand', price: '₱600 / ton', image: 'https://images.unsplash.com/photo-1558238712-4299bdf994a3?q=80&w=600&auto=format&fit=crop' },
    { name: 'Basalt Powder', details: 'Finely crushed basalt rock', price: '₱700 / ton', image: 'https://images.unsplash.com/photo-1584346850401-44754a6136d4?q=80&w=600&auto=format&fit=crop' },
  ];

  let productsSectionFound = false;
  currentSections = currentSections.map(s => {
    if (s.type === 'products') {
      productsSectionFound = true;
      return { ...s, items: products };
    }
    return s;
  });
  if (!productsSectionFound) {
    currentSections.push({ type: 'products', items: products });
  }

  // Ensure news section
  if (!currentSections.find(s => s.type === 'news')) {
    currentSections.push({ type: 'news', items: [] });
  }

  console.log('Pushing products to production Starblue page...');
  const pageRes = await fetch(`${PROD_API}/api/tenants/starblue/page`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: { sections: currentSections } })
  });

  if (pageRes.ok) {
    console.log('✅ Successfully seeded Starblue products in PRODUCTION!');
    console.log('Visit: https://stjosephapdc.vercel.app/tenants/starblue');
  } else {
    console.error('❌ Failed:', await pageRes.text());
  }
}

seedStarblueProduction();
