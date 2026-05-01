import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Pieza, SECCIONES, Seccion } from './types';

const contentDirectory = path.join(process.cwd(), 'content');

export function getPiezas(): Pieza[] {
  const piezas: Pieza[] = [];
  
  // Use SECCIONES to iterate over folders
  SECCIONES.forEach(seccion => {
    const sectionPath = path.join(contentDirectory, seccion);
    if (fs.existsSync(sectionPath)) {
      const files = fs.readdirSync(sectionPath);
      files.forEach(fileName => {
        if (fileName.endsWith('.mdx') || fileName.endsWith('.md')) {
          const fullPath = path.join(sectionPath, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data, content } = matter(fileContents);
          
          piezas.push({
            slug: fileName.replace(/\.mdx?$/, ''),
            titulo: data.titulo,
            seccion: data.seccion as Seccion,
            industria: data.industria,
            mecanismo: data.mecanismo,
            tema: data.tema,
            fecha: data.fecha instanceof Date ? data.fecha.toISOString().split('T')[0] : data.fecha,
            resumen: data.resumen,
            content,
          });
        }
      });
    }
  });

  return piezas.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
}

export function getPiezasBySeccion(seccion: string): Pieza[] {
  return getPiezas().filter(p => p.seccion === seccion);
}

export function getPieza(seccion: string, slug: string): Pieza | null {
  const piezas = getPiezas();
  return piezas.find(p => p.seccion === seccion && p.slug === slug) || null;
}

export function getAvailableTags(piezas: Pieza[]) {
  const industrias = Array.from(new Set(piezas.map(p => p.industria))).sort();
  const mecanismos = Array.from(new Set(piezas.flatMap(p => p.mecanismo))).sort();
  const temas = Array.from(new Set(piezas.map(p => p.tema))).sort();
  
  return { industrias, mecanismos, temas };
}
