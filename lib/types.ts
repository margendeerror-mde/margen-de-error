export type FormatId = "historia" | "conflicto" | "microanalisis";

export interface Topic {
  id: string;
  name: string;
  description: string;
  related_topic_ids: string[];
}

export interface Format {
  id: FormatId;
  name: string;
  description: string;
}

export const FORMATS: Record<FormatId, Format> = {
  historia: {
    id: "historia",
    name: "Historia",
    description: "Relatos narrativos sobre errores y giros en la ciencia.",
  },
  conflicto: {
    id: "conflicto",
    name: "Conflicto",
    description: "Exposición de conclusiones convenientes y conflictos de interés.",
  },
  microanalisis: {
    id: "microanalisis",
    name: "Microanálisis",
    description: "Lectura crítica y puntual de la evidencia.",
  },
};

export interface Piece {
  id: string;
  topic_id: string;
  format: FormatId;
  title: string;
  summary: string;
  tags: string[];
  content_raw: string;
}

export interface Tag {
  id: string;
  name: string;
}
