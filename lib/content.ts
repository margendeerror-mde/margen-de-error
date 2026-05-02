import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function getPiezasBySeccion(seccion: string) {
  const dir = path.join(process.cwd(), 'content', seccion);
  if (!fs.existsSync(dir)) return [];
  
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
    .map(filename => {
      const slug = filename.replace(/\.mdx?$/, '');
      const raw = fs.readFileSync(path.join(dir, filename), 'utf-8');
      const { data, content } = matter(raw);
      
      // Normalize mecanismo to array
      const mecanismo = Array.isArray(data.mecanismo) 
        ? data.mecanismo 
        : (data.mecanismo ? [data.mecanismo] : []);

      // Ensure fecha is a string
      const fecha = data.fecha instanceof Date 
        ? data.fecha.toISOString().split('T')[0] 
        : (data.fecha || new Date().toISOString().split('T')[0]);

      return { 
        slug, 
        titulo: data.titulo || 'Sin título',
        seccion: seccion,
        industria: data.industria || 'otro',
        mecanismo,
        tema: data.tema || 'general',
        fecha: String(fecha),
        resumen: data.resumen || '',
        content,
      };
    })
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

export function getAllPiezas() {
  const secciones = ['historias', 'conflictos', 'serendipia', 'analisis', 'marco'];
  return secciones.flatMap(s => getPiezasBySeccion(s));
}

export function getPieza(seccion: string, slug: string) {
  const dir = path.join(process.cwd(), 'content', seccion);
  let filepath = path.join(dir, `${slug}.md`);
  
  if (!fs.existsSync(filepath)) {
    filepath = path.join(dir, `${slug}.mdx`);
  }
  
  if (!fs.existsSync(filepath)) return null;
  
  const raw = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(raw);
  
  const mecanismo = Array.isArray(data.mecanismo) 
    ? data.mecanismo 
    : (data.mecanismo ? [data.mecanismo] : []);

  // Ensure fecha is a string
  const fecha = data.fecha instanceof Date 
    ? data.fecha.toISOString().split('T')[0] 
    : (data.fecha || new Date().toISOString().split('T')[0]);

  return { 
    slug, 
    titulo: data.titulo || 'Sin título',
    seccion: seccion,
    industria: data.industria || 'otro',
    mecanismo,
    tema: data.tema || 'general',
    fecha: String(fecha),
    resumen: data.resumen || '',
    content,
  };
}

export function getAvailableTags(piezas: any[]) {
  const tags = {
    industria: new Set<string>(),
    mecanismo: new Set<string>(),
    tema: new Set<string>()
  };

  piezas.forEach(p => {
    if (p.industria) tags.industria.add(p.industria);
    if (p.tema) tags.tema.add(p.tema);
    if (p.mecanismo) {
      p.mecanismo.forEach((m: string) => tags.mecanismo.add(m));
    }
  });

  return {
    industria: Array.from(tags.industria),
    mecanismo: Array.from(tags.mecanismo),
    tema: Array.from(tags.tema)
  };
}
