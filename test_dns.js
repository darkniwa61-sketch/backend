const dns = require('dns');
dns.resolveMx('gmail.com', (err, addresses) => {
  if (err) console.error(err);
  else console.log(addresses);
});
