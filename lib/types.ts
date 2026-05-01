export const SECCIONES = [
  'historias',
  'conflictos',
  'serendipia',
  'analisis',
  'marco'
] as const;

export const INDUSTRIAS = [
  'farmacéutica',
  'alimentaria',
  'cosmética',
  'tabaco',
  'energía',
  'institucional',
  'académica'
] as const;

export const MECANISMOS = [
  'financiamiento',
  'diseño de estudio',
  'titular engañoso',
  'omisión',
  'migración de estrategia',
  'conflicto de interés',
  'captura regulatoria'
] as const;

export const TEMAS = [
  'luz',
  'nutrición',
  'movimiento',
  'sueño',
  'mente',
  'microbioma',
  'dolor',
  'ambiente'
] as const;

export type Seccion = typeof SECCIONES[number];
export type Industria = typeof INDUSTRIAS[number];
export type Mecanismo = typeof MECANISMOS[number];
export type Tema = typeof TEMAS[number];

export interface PiezaFrontmatter {
  titulo: string;
  seccion: Seccion;
  industria: Industria;
  mecanismo: Mecanismo[];
  tema: Tema;
  fecha: string; // YYYY-MM-DD
  resumen: string;
}

export interface Pieza extends PiezaFrontmatter {
  slug: string;
  content: string; // MDX content
}
