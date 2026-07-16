import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content', 'temporadas');
const redirects = [];
const legacySections = ['historias', 'conflictos', 'serendipia', 'analisis', 'marco', 'podcast'];

if (fs.existsSync(contentDir)) {
  const seasons = fs.readdirSync(contentDir);
  for (const season of seasons) {
    const seasonPath = path.join(contentDir, season);
    if (fs.statSync(seasonPath).isDirectory()) {
      const files = fs.readdirSync(seasonPath).filter(f => f.endsWith('.md'));
      for (const file of files) {
        const rawSlug = file.replace(/\.mdx?$/, '');
        const slug = rawSlug.replace(/^e\d+-/, '');
        
        // We redirect ALL legacy sections to the new season URL to be safe,
        // because we don't store the old section in the file anymore.
        for (const sec of legacySections) {
          redirects.push({
            source: `/${sec}/${slug}`,
            destination: `/temporadas/${season}/${slug}`,
            permanent: true,
          });
        }
      }
    }
  }
}

console.log(JSON.stringify(redirects, null, 2));
