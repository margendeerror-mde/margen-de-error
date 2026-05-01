export const SECCIONES = [
  'historia',
  'conflicto',
  'serendipia',
  'análisis',
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

export const TEMA_COLORS: Record<Tema, string> = {
  'luz-y-radiación': '#F5C518',
  'nutrición': '#4CAF50',
  'movimiento-y-ejercicio': '#FF6B35',
  'sueño': '#7B68EE',
  'mente-y-conducta': '#00BCD4',
  'microbioma': '#8BC34A',
  'dolor': '#F44336',
  'ambiente-y-exposición': '#9E9E9E',
  'medicación-y-fármacos': '#E91E63',
  'diagnóstico-y-clasificación': '#FF9800',
  'hormonas-y-endocrino': '#9C27B0',
  'inmunidad': '#03A9F4',
  'envejecimiento': '#795548',
};
