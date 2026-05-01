const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8082,
  path: '/api/playlists',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
    // Intentionally omit token to see if it responds with 401/403 or throws 500 etc.
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => console.log(`BODY: ${body}`));
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(JSON.stringify({
    title: "Test",
    description: "",
    isPublic: true
}));
req.end();
