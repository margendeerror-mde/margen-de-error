import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Pieza, SECCIONES, Seccion } from './types';

const contentDirectory = path.join(process.cwd(), 'content');

export function getPiezas(): Pieza[] {
  let piezas: Pieza[] = [];

  SECCIONES.forEach((seccion) => {
    const seccionPath = path.join(contentDirectory, seccion);
    
    if (fs.existsSync(seccionPath)) {
      const fileNames = fs.readdirSync(seccionPath);
      
      fileNames.forEach((fileName) => {
        if (fileName.endsWith('.mdx') || fileName.endsWith('.md')) {
          const slug = fileName.replace(/\.mdx?$/, '');
          const fullPath = path.join(seccionPath, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          
          const { data, content } = matter(fileContents);
          
          piezas.push({
            slug,
            titulo: data.titulo,
            seccion: seccion as Seccion,
            industria: data.industria,
            mecanismo: Array.isArray(data.mecanismo) ? data.mecanismo : [data.mecanismo].filter(Boolean),
            tema: data.tema,
            fecha: data.fecha,
            resumen: data.resumen,
            content,
          });
        }
      });
    }
  });

  // Ordenar por fecha descendente
  return piezas.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
}

export function getPiezasBySeccion(seccion: string): Pieza[] {
  return getPiezas().filter((p) => p.seccion === seccion);
}

export function getPieza(seccion: string, slug: string): Pieza | undefined {
  return getPiezas().find((p) => p.seccion === seccion && p.slug === slug);
}

// Función auxiliar para obtener todas las opciones únicas usadas
export function getAvailableTags(piezas: Pieza[]) {
  const industrias = Array.from(new Set(piezas.map(p => p.industria))).filter(Boolean);
  const temas = Array.from(new Set(piezas.map(p => p.tema))).filter(Boolean);
  const mecanismos = Array.from(new Set(piezas.flatMap(p => p.mecanismo))).filter(Boolean);
  
  return { industrias, temas, mecanismos };
}
