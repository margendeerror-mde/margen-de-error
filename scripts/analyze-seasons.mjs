import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const SECCIONES = ['historias', 'conflictos', 'serendipia', 'analisis', 'marco', 'podcast'];
const contentDir = path.join(process.cwd(), 'content');

const allPieces = [];

for (const sec of SECCIONES) {
  const dir = path.join(contentDir, sec);
  if (!fs.existsSync(dir)) continue;
  
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const { data } = matter(raw);
    allPieces.push({
      path: `${sec}/${file}`,
      titulo: data.titulo,
      temporada: data.temporada || null,
      capitulo: data.capitulo || null,
      seccion: data.seccion || null
    });
  }
}

console.log(JSON.stringify(allPieces, null, 2));
