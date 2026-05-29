const fs = require('fs');
const path = require('path');
const https = require('https');
const matter = require('gray-matter');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    }, (res) => {
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
    
    let title = '';
    let description = '';
    let datePublished = new Date().toISOString().split('T')[0];
    
    // Parse JSON-LD
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (jsonLdMatch && jsonLdMatch[1]) {
      const data = JSON.parse(jsonLdMatch[1]);
      title = data.name || '';
      description = data.description || '';
      if (data.datePublished) {
        datePublished = data.datePublished;
      }
      
      // Validate show name from description
      const showNameMatch = description.match(/^Listen to this episode from (.+?) on Spotify\./i);
      const showName = showNameMatch ? showNameMatch[1].trim() : '';
      if (showName.toLowerCase() !== 'margen de error') {
        console.error(`ERROR: Este episodio pertenece al podcast "${showName || 'Desconocido'}", no a "Margen de Error".`);
        process.exit(1);
      }
      
      // Clean up description: strip "Listen to this episode from Margen de error on Spotify. "
      description = description.replace(/^Listen to this episode from .+? on Spotify\.\s*/i, '');
    } else {
      // Fallback: search for meta tags
      const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/);
      const ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/);
      
      if (ogTitle) title = ogTitle[1].replace(/&amp;/g, '&');
      if (ogDesc) {
        const ogDescContent = ogDesc[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"');
        // Validate show name from og:description
        const showMatch = ogDescContent.match(/^(.+?)\s*·\s*Episode/i);
        const showName = showMatch ? showMatch[1].trim() : '';
        if (showName.toLowerCase() !== 'margen de error') {
          console.error(`ERROR: Este episodio pertenece al podcast "${showName || 'Desconocido'}", no a "Margen de Error".`);
          process.exit(1);
        }
      }
      
      console.log("Warning: JSON-LD was not found, fallback to meta tags used. Date defaults to today.");
    }

    if (!title || !description) {
      console.error("Failed to parse episode title or description.");
      process.exit(1);
    }

    console.log(`Title: ${title}`);
    console.log(`Date: ${datePublished}`);
    console.log(`Description length: ${description?.length || 0}`);

    const slug = slugify(title);
    const dateStr = `${datePublished}T12:00:00.000Z`;
    const filepath = path.join(process.cwd(), 'content', 'podcast', `${slug}.md`);

    if (fs.existsSync(filepath)) {
      console.log(`File already exists. Updating existing file: ${filepath}`);
      const raw = fs.readFileSync(filepath, 'utf-8');
      const parsed = matter(raw);
      
      // Update only key fields
      parsed.data.fecha = dateStr;
      parsed.data.spotifyUrl = url;
      
      // Clean description prefix in the existing content if it was not cleaned before
      let cleanContent = parsed.content;
      if (cleanContent.trim().startsWith('Listen to this episode from')) {
        cleanContent = cleanContent.replace(/^Listen to this episode from .+? on Spotify\.\s*/i, '');
      }

      // Re-serialize back preserving all other custom frontmatter properties and body
      const updatedMarkdown = matter.stringify(cleanContent, parsed.data);
      fs.writeFileSync(filepath, updatedMarkdown, 'utf-8');
      console.log(`Successfully updated existing file while preserving manual metadata!`);
    } else {
      // Write brand new file
      const markdown = `---
titulo: "${title.replace(/"/g, '\\"')}"
seccion: podcast
industria: medios-y-comunicación
mecanismo: []
tema: mente-y-conducta
fecha: '${dateStr}'
resumen: >-
  ${description.split('\n')[0].replace(/"/g, '\\"')}
spotifyUrl: '${url}'
---

${description}
`;
      fs.writeFileSync(filepath, markdown, 'utf-8');
      console.log(`Created brand new file: ${filepath}`);
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

const url = process.argv[2];
if (!url) {
  console.log("Usage: node sync-podcast.js <spotify-url>");
  process.exit(1);
}

syncPodcast(url);
