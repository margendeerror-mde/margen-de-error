// ============================================================
// ATLAS DEL ERROR — Ontología de MDE
// ============================================================

/**
 * DISTORSIONES: Cuando la evidencia se manipula, se analiza mal
 * o se comunica de forma sesgada.
 */
export const ATLAS_DISTORSIONES = [
  'cherry-picking',
  'p-hacking',
  'confusión',
  'causalidad-inversa',
  'falacia-ecológica',
  'sesgo-de-publicación',
  'sobreinterpretación',
  'manufactura-de-duda',
  'inercia-institucional',
  'titular-engañoso',
  'correlación-presentada-como-causalidad',
  'diseño-sesgado',
  'omisión-de-datos',
  'sesgo-de-confirmacion',
  'migración-de-estrategia',
  'normalización-por-repetición',
  'captura-regulatoria',
  'conflicto-de-interés-no-declarado',
  'experto-capturado',
  'financiamiento-de-estudio',
] as const;

/**
 * LÍMITES DE LA INFERENCIA: Cuando la evidencia es honesta
 * y rigurosa, pero tiene fronteras epistemológicas naturales.
 */
export const ATLAS_LIMITES = [
  'límite-observacional',
  'endpoints-subrogados',
  'límite-de-extrapolación',
  'baja-potencia-estadística',
] as const;

export const ATLAS_MECANISMOS = [
  ...ATLAS_DISTORSIONES,
  ...ATLAS_LIMITES,
] as const;

export type AtlasMecanismo = typeof ATLAS_MECANISMOS[number];

/** Definiciones de diccionario del Atlas */
export const ATLAS_DEFINICIONES: Record<AtlasMecanismo, string> = {
  'cherry-picking': 'Selección no representativa de evidencia para favorecer una conclusión.',
  'p-hacking': 'Manipulación iterativa del análisis estadístico hasta forzar un resultado significativo.',
  'confusión': 'Una tercera variable, no medida o ignorada, explica la asociación observada.',
  'causalidad-inversa': 'Se asume que A causa B, cuando en realidad B está causando A.',
  'falacia-ecológica': 'Asumir que las correlaciones a nivel de poblaciones aplican a los individuos.',
  'sesgo-de-publicación': 'Los resultados negativos o no concluyentes circulan menos que los positivos.',
  'sobreinterpretación': 'Sacar conclusiones causales o prescriptivas que el diseño del estudio no permite.',
  'manufactura-de-duda': 'Financiar y amplificar incertidumbre científica para impedir o retrasar la acción.',
  'inercia-institucional': 'Resistencia sistémica de revistas, reguladores y comunidades a aceptar evidencia que contradice el paradigma dominante.',
  'límite-observacional': 'La imposibilidad de establecer causalidad firme sin experimentación controlada.',
  'endpoints-subrogados': 'Medir o modificar un marcador biológico asumiendo que refleja o predice el desenlace clínico que realmente importa.',
  'límite-de-extrapolación': 'Asumir que un resultado en una población controlada o modelo animal funcionará igual en la población general.',
  'baja-potencia-estadística': 'El tamaño de la muestra es insuficiente para distinguir un efecto real del ruido azaroso.',
};

/** Tipo del Atlas: distorsión o límite */
export type AtlasTipo = 'distorsión' | 'límite';

export function getAtlasTipo(mecanismo: AtlasMecanismo): AtlasTipo {
  return (ATLAS_DISTORSIONES as readonly string[]).includes(mecanismo) 
    ? 'distorsión' 
    : 'límite';
}

// ============================================================
// METADATA DE CONDICIONES (no son mecanismos, son contexto)
// ============================================================

export const CONDICIONES = [
  'conflicto-de-interés',
  'financiamiento-industrial',
  'captura-regulatoria',
  'lobby-industrial',
  'incentivos-académicos',
  'autoridad-científica',
  'financiamiento-oscuro',
  'especialización-fragmentada',
] as const;

export type Condicion = typeof CONDICIONES[number];

// ============================================================
// INDUSTRIAS Y TEMAS (se mantienen)
// ============================================================

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

export type Industria = string;
export type Tema = string;

// ============================================================
// VOLUMENES
// ============================================================

export const VOLUMENES: Record<number, { titulo: string; descripcion: string }> = {
  1: {
    titulo: 'Cómo se deforma la evidencia',
    descripcion: 'Los mecanismos que distorsionan la producción, el análisis y la comunicación del conocimiento científico.',
  },
  2: {
    titulo: 'Las personas detrás de las ideas',
    descripcion: 'Historias de científicos que desafiaron el consenso, descubrieron por accidente y pagaron el precio de tener razón demasiado pronto.',
  },
  3: {
    titulo: 'Los límites de la evidencia',
    descripcion: 'Qué puede decir —y qué no— la evidencia científica sobre las preguntas que más importan.',
  },
};

// ============================================================
// PIEZA (tipo principal)
// ============================================================

export interface PiezaFrontmatter {
  titulo: string;
  industria: Industria;
  mecanismo: string[];        // legacy field (kept for backward compat)
  atlas: AtlasMecanismo[];    // NEW: mecanismos del Atlas
  pregunta: string;           // NEW: la pregunta que el episodio responde
  condiciones: string[];      // NEW: contexto institucional
  tema: Tema;
  fecha: string;
  resumen: string;
  temporada?: number;         // internally still called temporada for backwards compat with markdown
  capitulo?: number;
  spotifyUrl?: string;
  publicado?: boolean;
}

export interface Pieza extends PiezaFrontmatter {
  slug: string;
  content: string;
  href: string;
  publicado: boolean;
}

// ============================================================
// COLORES
// ============================================================

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

export const VOLUMEN_COLORS: Record<number, string> = {
  1: "#C4763A",
  2: "#B5431A",
  3: "#264653"
};

/** Colores para los dos hemisferios del Atlas */
export const ATLAS_COLORS = {
  distorsión: '#CC0000',
  límite: '#2E5F7A',
} as const;
