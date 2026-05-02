import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const SECCIONES = ['historias', 'conflictos', 'serendipia', 'analisis', 'marco'];

export interface Pieza {
  slug: string;
  seccion: string;
  titulo: string;
  resumen: string;
  fecha: string;
  industria: string;
  mecanismo: string[];
  tema: string;
  content: string;
  href: string;
}

export function normalizeTag(val: unknown): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(String).filter(Boolean);
  if (typeof val === 'string') return [val].filter(Boolean);
  return [];
}

export function getPiezasBySeccion(seccion: string): Pieza[] {
  const dir = path.join(process.cwd(), 'content', seccion);
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(filename => {
      const slug = filename.replace('.md', '');
      const raw = fs.readFileSync(path.join(dir, filename), 'utf-8');
      const { data, content } = matter(raw);
      
      return {
        slug,
        seccion,
        titulo: String(data.titulo || ''),
        resumen: String(data.resumen || ''),
        fecha: data.fecha instanceof Date 
          ? data.fecha.toISOString().split('T')[0] 
          : String(data.fecha || ''),
        industria: String(data.industria || ''),
        mecanismo: normalizeTag(data.mecanismo),
        tema: String(data.tema || ''),
        content,
        href: `/${seccion}/${slug}`,
      };
    })
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

export function getAllPiezas(): Pieza[] {
  return SECCIONES.flatMap(s => getPiezasBySeccion(s));
}

export function getPieza(seccion: string, slug: string): Pieza | null {
  const filepath = path.join(process.cwd(), 'content', seccion, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;
  
  const raw = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(raw);
  
  return {
    slug,
    seccion,
    titulo: String(data.titulo || ''),
    resumen: String(data.resumen || ''),
    fecha: data.fecha instanceof Date 
      ? data.fecha.toISOString().split('T')[0] 
      : String(data.fecha || ''),
    industria: String(data.industria || ''),
    mecanismo: normalizeTag(data.mecanismo),
    tema: String(data.tema || ''),
    content,
    href: `/${seccion}/${slug}`,
  };
}

export function getAvailableTags(piezas: Pieza[]) {
  const tags = {
    industria: new Set<string>(),
    mecanismo: new Set<string>(),
    tema: new Set<string>()
  };

  piezas.forEach(p => {
    if (p.industria) tags.industria.add(p.industria);
    if (p.tema) tags.tema.add(p.tema);
    p.mecanismo.forEach(m => tags.mecanismo.add(m));
  });

  return {
    industria: Array.from(tags.industria),
    mecanismo: Array.from(tags.mecanismo),
    tema: Array.from(tags.tema)
  };
}
