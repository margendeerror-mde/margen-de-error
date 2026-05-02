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

export type Seccion = string;
export type Industria = string;
export type Mecanismo = string;
export type Tema = string;

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
  "luz-y-radiación":            "#FFF3B0",
  "nutrición":                  "#C8E6C9",
  "movimiento-y-ejercicio":     "#FFD5B8",
  "sueño":                      "#D4C5F9",
  "mente-y-conducta":           "#B2EBF2",
  "microbioma":                 "#DCEDC8",
  "dolor":                      "#FFCDD2",
  "ambiente-y-exposición":      "#CFD8DC",
  "medicación-y-fármacos":      "#F8BBD0",
  "diagnóstico-y-clasificación":"#FFE0B2",
  "hormonas-y-endocrino":       "#E1BEE7",
  "inmunidad":                  "#B3E5FC",
  "envejecimiento":             "#D7CCC8",
};
export const SECCION_COLORS: Record<string, string> = {
  historias:  "#C4763A", // Ámbar tostado
  conflictos: "#B5431A", // Rojo ocre
  serendipia: "#2E5F7A", // Azul pizarra
  analisis:   "#4A6741", // Verde musgo
  marco:      "#5C4A7A", // Violeta ceniza
};
