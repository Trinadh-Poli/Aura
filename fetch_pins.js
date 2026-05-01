const https = require('https');
const fs = require('fs');

const pins = {
  "Taylor Swift": "https://pin.it/GQYxGb8qD",
  "Lana Del Rey": "https://pin.it/4yQw0vQJf",
  "Katy Perry": "https://pin.it/3fQO6plBh",
  "Justin Bieber": "https://pin.it/4UFdFmHgu",
  "Selena Gomez": "https://pin.it/4sHt38NUT",
  "Ariana Grande": "https://pin.it/4IKtSX7Pa",
  "The Weeknd": "https://pin.it/3rGqw4kGU",
  "Olivia Rodrigo": "https://pin.it/3kqKqztXp",
  "One Direction": "https://pin.it/2xL1M2zOe",
  "Sia": "https://pin.it/CXcw3mCOL"
};

const fetchUrl = (url, depth = 0) => new Promise((resolve, reject) => {
  if (depth > 5) return reject(new Error('Too many redirects'));
  
  const req = https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5'
    }
  }, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      resolve(fetchUrl(res.headers.location.startsWith('http') ? res.headers.location : `https://pinterest.com${res.headers.location}`, depth + 1));
    } else {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }
  });
  
  req.on('error', reject);
  req.setTimeout(5000, () => {
    req.destroy();
    reject(new Error('Timeout'));
  });
});

async function main() {
  const results = {};
  for (const [artist, url] of Object.entries(pins)) {
    try {
      console.log(`Fetching ${artist}...`);
      const html = await fetchUrl(url);
      const match = html.match(/<meta property="og:image"\s*(?:name="og:image"\s*)?content="([^"]+)"/i) || 
                    html.match(/<meta content="([^"]+)"\s*property="og:image"/i) ||
                    html.match(/"image":\s*"([^"]+)"/i);
      results[artist] = match ? match[1] : `HTML len: ${html.length}`;
    } catch (e) {
      console.error(e.message);
      results[artist] = `ERROR: ${e.message}`;
    }
  }
  fs.writeFileSync('extracted_pins.json', JSON.stringify(results, null, 2));
  console.log('DONE');
  process.exit(0);
}

main();
