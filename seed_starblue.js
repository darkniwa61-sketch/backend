
async function seedStarblue() {
  const API_URL = 'http://127.0.0.1:4000/api/tenants/starblue';
  
  // 1. Fetch current page content to preserve other sections
  console.log('Fetching current Starblue page...');
  let currentSections = [];
  try {
    const res = await fetch(API_URL);
    if (res.ok) {
      const data = await res.json();
      currentSections = data.pages?.[0]?.content?.sections || [];
    }
  } catch (e) {
    console.error('Failed to fetch existing sections:', e);
  }

  // 2. Define products
  const products = [
    { name: 'Banday banda', details: 'Premium aggregate mix', price: '₱400 / ton', image: 'https://images.unsplash.com/photo-1517596001157-1dfd374477db?q=80&w=600&auto=format&fit=crop' },
    { name: 'Banlik / Mineral Filler', details: 'Fine mineral filler', price: '₱250 / ton', image: 'https://images.unsplash.com/photo-1616167812845-a7465377f5f2?q=80&w=600&auto=format&fit=crop' },
    { name: 'Topsoil / Backfill', details: 'High-quality soil for filling', price: '₱300 / cubic meter', image: 'https://images.unsplash.com/photo-1581452934177-38e9fc78018e?q=80&w=600&auto=format&fit=crop' },
    { name: 'Weathered Rock', details: 'Durable weathered stone', price: '₱550 / ton', image: 'https://images.unsplash.com/photo-1518338950853-4dc9b8e97491?q=80&w=600&auto=format&fit=crop' },
    { name: 'Blue Sand Vibro', details: 'Specialized blue vibro sand', price: '₱600 / ton', image: 'https://images.unsplash.com/photo-1558238712-4299bdf994a3?q=80&w=600&auto=format&fit=crop' },
    { name: 'Basalt Powder', details: 'Finely crushed basalt rock', price: '₱700 / ton', image: 'https://images.unsplash.com/photo-1584346850401-44754a6136d4?q=80&w=600&auto=format&fit=crop' },
  ];

  // 3. Update products section
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

  // Ensure hero section exists for rendering the page
  let heroSectionFound = false;
  currentSections = currentSections.map(s => {
    if (s.type === 'hero') {
      heroSectionFound = true;
      return { ...s, backgroundImage: 'https://images.unsplash.com/photo-1513828742140-ccaa28f3eda0?q=80&w=2000&auto=format&fit=crop' }; // Quarry image
    }
    return s;
  });
  if (!heroSectionFound) {
    currentSections.push({ type: 'hero', backgroundImage: 'https://images.unsplash.com/photo-1513828742140-ccaa28f3eda0?q=80&w=2000&auto=format&fit=crop', title: 'Building the Future', subtitle: 'Premium Aggregates' });
  }

  // 4. Update the page
  console.log('Pushing updated products to Starblue page...');
  const pageRes = await fetch(`${API_URL}/page`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: { sections: currentSections } })
  });

  if (pageRes.ok) {
    console.log('Successfully seeded Starblue products!');
  } else {
    console.error('Failed to update page:', await pageRes.text());
  }
}

seedStarblue();
