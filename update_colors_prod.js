async function updateProdColors() {
  const PROD_API = 'https://promotional-cms-backend.onrender.com';

  const res = await fetch(`${PROD_API}/api/tenants/starblue`);
  const tenant = await res.json();

  const updated = await fetch(`${PROD_API}/api/tenants/starblue`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: tenant.name,
      primaryColor: '#1e3a8a',
      secondaryColor: '#3b82f6',
      logoUrl: tenant.logoUrl,
      contactPhone: tenant.contactPhone,
      contactEmail: tenant.contactEmail,
      socialLinks: tenant.socialLinks
    })
  });

  if (updated.ok) {
    console.log('✅ Production colors updated!');
  } else {
    console.error('❌ Failed:', await updated.text());
  }
}
updateProdColors();
