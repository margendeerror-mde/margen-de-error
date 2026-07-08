/**
 * Script de migración de la estructura de archivos a Temporadas.
 * 
 * 1. Lee todas las piezas en las secciones actuales (excepto podcast).
 * 2. Busca si existe un artículo espejo en `podcast/` y extrae su `spotifyUrl`.
 * 3. Mueve la pieza a `content/temporadas/<temp>/e<cap>-<slug>.md` o `content/archivo/<slug>.md`.
 * 4. Elimina los directorios antiguos.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');
const SECCIONES = ['historias', 'conflictos', 'serendipia', 'analisis', 'marco'];

// Create new directories
const temporadasDir = path.join(contentDir, 'temporadas');
const archivoDir = path.join(contentDir, 'archivo');

if (!fs.existsSync(temporadasDir)) fs.mkdirSync(temporadasDir);
if (!fs.existsSync(archivoDir)) fs.mkdirSync(archivoDir);

let moved = 0;

for (const sec of SECCIONES) {
  const dir = path.join(contentDir, sec);
  if (!fs.existsSync(dir)) continue;

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  
  for (const file of files) {
    const oldPath = path.join(dir, file);
    const raw = fs.readFileSync(oldPath, 'utf-8');
    const { data, content } = matter(raw);

    // 1. Look for mirror podcast file to extract spotifyUrl
    const podcastPath = path.join(contentDir, 'podcast', file);
    if (fs.existsSync(podcastPath)) {
      const podcastRaw = fs.readFileSync(podcastPath, 'utf-8');
      const podcastMatter = matter(podcastRaw);
      if (podcastMatter.data.spotifyUrl && !data.spotifyUrl) {
        data.spotifyUrl = podcastMatter.data.spotifyUrl;
      }
    }

    // 2. Remove obsolete frontmatter fields
    delete data.seccion;

    // 3. Determine new path
    let newPath;
    if (data.temporada && data.capitulo) {
      const tempDir = path.join(temporadasDir, String(data.temporada));
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
      
      const paddedCap = String(data.capitulo).padStart(2, '0');
      newPath = path.join(tempDir, `e${paddedCap}-${file}`);
    } else {
      newPath = path.join(archivoDir, file);
    }

    // 4. Write new file
    const updatedRaw = matter.stringify(content, data);
    fs.writeFileSync(newPath, updatedRaw, 'utf-8');
    
    // 5. Delete old file
    fs.unlinkSync(oldPath);
    if (fs.existsSync(podcastPath)) {
      fs.unlinkSync(podcastPath);
    }
    
    moved++;
    console.log(`Moved: ${sec}/${file} -> ${newPath.replace(process.cwd(), '')}`);
  }
}

// Clean up old directories
const allOldDirs = [...SECCIONES, 'podcast'];
for (const dir of allOldDirs) {
  const fullDir = path.join(contentDir, dir);
  if (fs.existsSync(fullDir)) {
    const remaining = fs.readdirSync(fullDir);
    for (const f of remaining) {
      fs.unlinkSync(path.join(fullDir, f));
    }
    fs.rmdirSync(fullDir);
  }
}

console.log(`\nMigration complete. Moved ${moved} files.`);
