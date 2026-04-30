import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Pieza, PiezaMeta, Seccion, SECCIONES } from './types';

const contentDirectory = path.join(process.cwd(), 'content');

/**
 * Lee todos los archivos .mdx de una sección y devuelve su metadata
 */
function getPiezasFromDirectory(seccion: Seccion): PiezaMeta[] {
  const sectionDir = path.join(contentDirectory, seccion);

  if (!fs.existsSync(sectionDir)) {
    return [];
  }

  const files = fs.readdirSync(sectionDir).filter((f) => f.endsWith('.mdx'));

  return files.map((filename) => {
    const filePath = path.join(sectionDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    const slug = filename.replace(/\.mdx$/, '');

    return {
      slug,
      titulo: data.titulo || '',
      seccion: data.seccion || seccion,
      industria: data.industria || '',
      mecanismo: Array.isArray(data.mecanismo)
        ? data.mecanismo
        : [data.mecanismo].filter(Boolean),
      fecha: data.fecha
        ? new Date(data.fecha).toISOString().split('T')[0]
        : '',
      resumen: data.resumen || '',
    };
  });
}

/**
 * Obtiene todas las piezas de todas las secciones, ordenadas por fecha (más reciente primero)
 */
export function getAllPiezas(): PiezaMeta[] {
  const allPiezas = SECCIONES.flatMap((seccion) =>
    getPiezasFromDirectory(seccion)
  );

  return allPiezas.sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

/**
 * Obtiene todas las piezas de una sección específica
 */
export function getPiezasBySeccion(seccion: Seccion): PiezaMeta[] {
  return getPiezasFromDirectory(seccion).sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

/**
 * Obtiene una pieza completa (con contenido) por sección y slug
 */
export function getPiezaBySlug(
  seccion: Seccion,
  slug: string
): Pieza | null {
  const filePath = path.join(contentDirectory, seccion, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    slug,
    titulo: data.titulo || '',
    seccion: data.seccion || seccion,
    industria: data.industria || '',
    mecanismo: Array.isArray(data.mecanismo)
      ? data.mecanismo
      : [data.mecanismo].filter(Boolean),
    fecha: data.fecha
      ? new Date(data.fecha).toISOString().split('T')[0]
      : '',
    resumen: data.resumen || '',
    contenido: content,
  };
}

/**
 * Obtiene la pieza anterior y siguiente dentro de la misma sección
 */
export function getAdjacentPiezas(
  seccion: Seccion,
  slug: string
): { prev: PiezaMeta | null; next: PiezaMeta | null } {
  const piezas = getPiezasBySeccion(seccion);
  const index = piezas.findIndex((p) => p.slug === slug);

  return {
    prev: index < piezas.length - 1 ? piezas[index + 1] : null,
    next: index > 0 ? piezas[index - 1] : null,
  };
}

/**
 * Genera todos los params estáticos para las piezas
 */
export function getAllPiezaSlugs(): { seccion: string; slug: string }[] {
  return SECCIONES.flatMap((seccion) => {
    const sectionDir = path.join(contentDirectory, seccion);
    if (!fs.existsSync(sectionDir)) return [];

    return fs
      .readdirSync(sectionDir)
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => ({
        seccion,
        slug: f.replace(/\.mdx$/, ''),
      }));
  });
}
