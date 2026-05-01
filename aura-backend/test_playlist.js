const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8082,
  path: '/api/playlists',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test-token' // Needs a valid token, or we can just try to get 403 or 500
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
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
