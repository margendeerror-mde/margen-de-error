const fs = require('fs');
const path = require('path');
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function syncPodcast(url) {
  console.log(`Fetching ${url}...`);
  try {
    const html = await fetchUrl(url);
    
    // Spotify injects its store state into a script tag
    // We can extract it using Regex
    const match = html.match(/<script id="initial-state" type="text\/plain">(.*?)<\/script>/);
    let title = '';
    let description = '';
    
    if (match && match[1]) {
      const state = JSON.parse(Buffer.from(match[1], 'base64').toString('utf-8'));
      // Search recursively for description
      const jsonStr = JSON.stringify(state);
      const nameMatch = jsonStr.match(/"name":"([^"]+)"/);
      const descMatch = jsonStr.match(/"description":"([^"]+)"/);
      if (nameMatch) title = nameMatch[1];
      if (descMatch) description = descMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
    } else {
      // Fallback: search for meta tags
      const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/);
      const ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/);
      const metaDesc = html.match(/<meta name="description" content="([^"]+)"/);
      
      if (ogTitle) title = ogTitle[1].replace(/&amp;/g, '&');
      if (metaDesc) {
        description = metaDesc[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"');
      } else if (ogDesc) {
        description = ogDesc[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"');
      }
    }

    if (!title || !description) {
      console.log("Could not find title or description in the Spotify page.");
      // Just extract from generic Regex
      const tMatch = html.match(/"name":"([^"]+)"/);
      const dMatch = html.match(/"description":"([^"]+)"/);
      if (tMatch) title = tMatch[1];
      if (dMatch) description = dMatch[1];
    }

    if (!title) {
      console.error("Failed to parse episode data.");
      process.exit(1);
    }

    console.log(`Title: ${title}`);
    console.log(`Description length: ${description?.length || 0}`);

    const slug = slugify(title);
    const today = new Date().toISOString().split('T')[0];

    const markdown = `---
titulo: "${title.replace(/"/g, '\\"')}"
seccion: podcast
industria: medios-y-comunicación
mecanismo: []
tema: mente-y-conducta
fecha: ${today}T12:00:00.000Z
resumen: >-
  ${description.split('\n')[0].replace(/"/g, '\\"')}
spotifyUrl: '${url}'
---

${description}
`;

    const filepath = path.join(process.cwd(), 'content', 'podcast', `${slug}.md`);
    fs.writeFileSync(filepath, markdown, 'utf-8');
    console.log(`Created file: ${filepath}`);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

const url = process.argv[2];
if (!url) {
  console.log("Usage: node sync-podcast.js <spotify-url>");
  process.exit(1);
}

syncPodcast(url);
