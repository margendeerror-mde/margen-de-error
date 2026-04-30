// ─── Margen de Error — Tipos del sistema de contenido ───

export const SECCIONES = [
  'historias',
  'conflictos',
  'serendipia',
  'analisis',
  'marco',
] as const;

export type Seccion = (typeof SECCIONES)[number];

export const SECCIONES_META: Record<
  Seccion,
  { titulo: string; descripcion: string; slug: string }
> = {
  historias: {
    titulo: 'Historias',
    descripcion:
      'Relatos narrativos sobre errores, giros inesperados y caminos torcidos en la construcción del conocimiento científico.',
    slug: 'historias',
  },
  conflictos: {
    titulo: 'Conflictos',
    descripcion:
      'Conclusiones demasiado convenientes, financiamientos opacos y conflictos de interés en la producción científica.',
    slug: 'conflictos',
  },
  serendipia: {
    titulo: 'Serendipia',
    descripcion:
      'Descubrimientos que llegaron por accidente, error o pura casualidad — y cambiaron lo que sabíamos.',
    slug: 'serendipia',
  },
  analisis: {
    titulo: 'Análisis',
    descripcion:
      'Lectura crítica de papers en tiempo real. Lo que dicen, lo que no dicen y lo que implican.',
    slug: 'analisis',
  },
  marco: {
    titulo: 'Marco',
    descripcion:
      'Epistemología aplicada. Conceptos y herramientas para entender cómo funciona la ciencia como sistema.',
    slug: 'marco',
  },
};

export const INDUSTRIAS = [
  'farmacéutica',
  'alimentaria',
  'cosmética',
  'tabaco',
  'energía',
  'institucional',
  'académica',
] as const;

export type Industria = (typeof INDUSTRIAS)[number];

export const MECANISMOS = [
  'financiamiento',
  'diseño de estudio',
  'titular engañoso',
  'omisión',
  'migración de estrategia',
  'conflicto de interés',
  'captura regulatoria',
] as const;

export type Mecanismo = (typeof MECANISMOS)[number];

export interface Pieza {
  slug: string;
  titulo: string;
  seccion: Seccion;
  industria: Industria;
  mecanismo: Mecanismo[];
  fecha: string;
  resumen: string;
  contenido: string;
}

export interface PiezaMeta {
  slug: string;
  titulo: string;
  seccion: Seccion;
  industria: Industria;
  mecanismo: Mecanismo[];
  fecha: string;
  resumen: string;
}
