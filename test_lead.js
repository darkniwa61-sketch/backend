const fetch = require('node-fetch');

async function test() {
  const data = {
    name: 'John Doe',
    email: 'john@example.com',
    interest: 'Schedule a Viewing',
    message: 'This is a test message that is long enough',
    date: '2023-10-10',
    time: '14:30'
  };

  try {
    const res = await fetch('http://localhost:4000/api/tenants/st-joseph/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Body:', text);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
