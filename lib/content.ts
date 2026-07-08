import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Pieza, AtlasMecanismo } from './types';

export type { Pieza };

export function normalizeTag(val: unknown): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(String).filter(Boolean);
  if (typeof val === 'string') return [val].filter(Boolean);
  return [];
}

// Helper to remove eXX- prefix from filename to get original slug
function getSlugFromFilename(filename: string): string {
  const rawSlug = filename.replace(/\.mdx?$/, '');
  return rawSlug.replace(/^e\d+-/, ''); // strips e01- if present
}

function parsePieza(filepath: string, filename: string): Pieza {
  const slug = getSlugFromFilename(filename);
  const raw = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(raw);

  let href = `/atlas/${slug}`;
  if (data.temporada && data.capitulo) {
    href = `/volumenes/${data.temporada}/${slug}`;
  }

  // By default, assume a piece is NOT published unless explicitly stated.
  const publicado = typeof data.publicado === 'boolean' ? data.publicado : false;

  const rawMecanismos = normalizeTag(data.mecanismo);
  const rawAtlas = normalizeTag(data.atlas);
  const combinedAtlas = Array.from(new Set([...rawAtlas, ...rawMecanismos])) as AtlasMecanismo[];

  return {
    slug,
    titulo: String(data.titulo || ''),
    resumen: String(data.resumen || ''),
    fecha: data.fecha instanceof Date
      ? data.fecha.toISOString().split('T')[0]
      : String(data.fecha || ''),
    industria: String(data.industria || ''),
    mecanismo: rawMecanismos,
    atlas: combinedAtlas,
    pregunta: String(data.pregunta || ''),
    condiciones: normalizeTag(data.condiciones),
    tema: String(data.tema || ''),
    content,
    href,
    spotifyUrl: data.spotifyUrl ? String(data.spotifyUrl) : undefined,
    temporada: data.temporada ? Number(data.temporada) : undefined,
    capitulo: data.capitulo ? Number(data.capitulo) : undefined,
    publicado,
  };
}

export function getAllPiezas(): Pieza[] {
  const piezas: Pieza[] = [];
  const contentDir = path.join(process.cwd(), 'content');
  
  // Read volumenes
  const tempDir = path.join(contentDir, 'volumenes');
  if (fs.existsSync(tempDir)) {
    const seasons = fs.readdirSync(tempDir);
    for (const season of seasons) {
      const seasonPath = path.join(tempDir, season);
      if (fs.statSync(seasonPath).isDirectory()) {
        const files = fs.readdirSync(seasonPath).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
        for (const file of files) {
          piezas.push(parsePieza(path.join(seasonPath, file), file));
        }
      }
    }
  }

  // Read archivo
  const archivoDir = path.join(contentDir, 'archivo');
  if (fs.existsSync(archivoDir)) {
    const files = fs.readdirSync(archivoDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
    for (const file of files) {
      piezas.push(parsePieza(path.join(archivoDir, file), file));
    }
  }

  return piezas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

export function getPieza(temporadaIdOrArchivo: string | number, slug: string): Pieza | null {
  const piezas = getAllPiezas();
  return piezas.find(p => p.slug === slug) || null;
}

/** Get all piezas grouped by temporada */
export function getPiezasByTemporada(): Record<number, Pieza[]> {
  const todas = getAllPiezas();
  const grouped: Record<number, Pieza[]> = {};

  for (const p of todas) {
    if (!p.temporada) continue;
    const t = p.temporada;
    if (!grouped[t]) grouped[t] = [];
    grouped[t].push(p);
  }

  // Sort by capitulo inside each season
  for (const key of Object.keys(grouped)) {
    grouped[Number(key)].sort((a, b) => (a.capitulo || 0) - (b.capitulo || 0));
  }

  return grouped;
}

export function getAvailableTags(piezas: Pieza[]) {
  const tags = {
    industria: new Set<string>(),
    mecanismo: new Set<string>(),
    atlas: new Set<string>(),
    tema: new Set<string>(),
    condiciones: new Set<string>(),
  };

  piezas.forEach(p => {
    if (p.industria) tags.industria.add(p.industria);
    if (p.tema) tags.tema.add(p.tema);
    p.mecanismo.forEach(m => tags.mecanismo.add(m));
    p.atlas.forEach(a => tags.atlas.add(a));
    p.condiciones.forEach(c => tags.condiciones.add(c));
  });

  return {
    industria: Array.from(tags.industria),
    mecanismo: Array.from(tags.mecanismo),
    atlas: Array.from(tags.atlas),
    tema: Array.from(tags.tema),
    condiciones: Array.from(tags.condiciones),
  };
}
