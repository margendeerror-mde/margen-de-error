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
  'cosmética-y-cuidado-personal',
  'tabaco',
  'alcohol',
  'suplementos-y-bienestar',
  'dispositivos-médicos',
  'seguros-de-salud',
  'agroquímica',
  'energía',
  'institucional-académica',
  'organismos-reguladores',
  'medios-y-comunicación'
] as const;

export const MECANISMOS = [
  'financiamiento-de-estudio',
  'diseño-sesgado',
  'titular-engañoso',
  'omisión-de-datos',
  'cherry-picking',
  'captura-regulatoria',
  'migración-de-estrategia',
  'conflicto-de-interés-no-declarado',
  'sesgo-de-publicación',
  'experto-capturado',
  'manufactura-de-duda',
  'normalización-por-repetición',
  'correlación-presentada-como-causalidad'
] as const;

export const TEMAS = [
  'luz-y-radiación',
  'nutrición',
  'movimiento-y-ejercicio',
  'sueño',
  'mente-y-conducta',
  'microbioma',
  'dolor',
  'ambiente-y-exposición',
  'medicación-y-fármacos',
  'diagnóstico-y-clasificación',
  'hormonas-y-endocrino',
  'inmunidad',
  'envejecimiento'
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
