const http = require('http');

http.get('http://localhost:8082/api/artists', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const list = JSON.parse(data);
    console.log(JSON.stringify(list.content || list, null, 2).substring(0, 1500));
  });
}).on('error', err => console.error(err));
