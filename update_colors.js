async function updateStarblueColors() {
  const API_URL = 'http://127.0.0.1:4000/api/tenants/starblue';
  
  console.log('Fetching current Starblue tenant...');
  let tenant = null;
  try {
    const res = await fetch(API_URL);
    if (res.ok) {
      tenant = await res.json();
    }
  } catch (e) {
    console.error('Failed to fetch existing tenant:', e);
    return;
  }

  if (!tenant) return;

  // Dark Navy (primary) and Royal Blue (secondary)
  const updatedData = {
    name: tenant.name,
    primaryColor: '#1e3a8a',
    secondaryColor: '#3b82f6',
    logoUrl: tenant.logoUrl,
    contactPhone: tenant.contactPhone,
    contactEmail: tenant.contactEmail,
    socialLinks: tenant.socialLinks
  };

  console.log('Pushing updated colors to Starblue...');
  const res = await fetch(API_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  });

  if (res.ok) {
    console.log('Successfully updated Starblue colors!');
  } else {
    console.error('Failed to update tenant:', await res.text());
  }
}

updateStarblueColors();
