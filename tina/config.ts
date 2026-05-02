import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "dummy-id",
  token: process.env.TINA_TOKEN || "dummy-token",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "historias",
        label: "Historias",
        path: "content/historias",
        format: "md",
        ui: {
          filename: {
            slugify: (values) =>
              values?.titulo
                ?.toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') || '',
          },
        },
        fields: camposComunes(),
      },
      {
        name: "conflictos",
        label: "Conflictos",
        path: "content/conflictos",
        format: "md",
        ui: {
          filename: {
            slugify: (values) =>
              values?.titulo
                ?.toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') || '',
          },
        },
        fields: camposComunes(),
      },
      {
        name: "serendipia",
        label: "Serendipia",
        path: "content/serendipia",
        format: "md",
        ui: {
          filename: {
            slugify: (values) =>
              values?.titulo
                ?.toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') || '',
          },
        },
        fields: camposComunes(),
      },
      {
        name: "analisis",
        label: "Análisis",
        path: "content/analisis",
        format: "md",
        ui: {
          filename: {
            slugify: (values) =>
              values?.titulo
                ?.toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') || '',
          },
        },
        fields: camposComunes(),
      },
      {
        name: "marco",
        label: "Marco",
        path: "content/marco",
        format: "md",
        ui: {
          filename: {
            slugify: (values) =>
              values?.titulo
                ?.toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') || '',
          },
        },
        fields: camposComunes(),
      },
    ],
  },
});

function camposComunes() {
  return [
    {
      type: "string" as const,
      name: "titulo",
      label: "Título",
      isTitle: true,
      required: true,
    },
    {
      type: "string" as const,
      name: "seccion",
      label: "Sección",
      required: true,
      options: ["historia", "conflicto", "serendipia", "análisis", "marco"],
    },
    {
      type: "string" as const,
      name: "industria",
      label: "Industria",
      required: true,
      options: [
        "farmacéutica", "alimentaria", "cosmética-y-cuidado-personal",
        "tabaco", "alcohol", "suplementos-y-bienestar",
        "dispositivos-médicos", "seguros-de-salud", "agroquímica",
        "energía", "institucional-académica", "organismos-reguladores",
        "medios-y-comunicación"
      ],
    },
    {
      type: "string" as const,
      name: "mecanismo",
      label: "Mecanismo",
      list: true,
      options: [
        "financiamiento-de-estudio", "diseño-sesgado", "titular-engañoso",
        "omisión-de-datos", "cherry-picking", "captura-regulatoria",
        "migración-de-estrategia", "conflicto-de-interés-no-declarado",
        "sesgo-de-publicación", "experto-capturado", "manufactura-de-duda",
        "normalización-por-repetición", "correlación-presentada-como-causalidad"
      ],
    },
    {
      type: "string" as const,
      name: "tema",
      label: "Tema",
      required: true,
      options: [
        "luz-y-radiación", "nutrición", "movimiento-y-ejercicio",
        "sueño", "mente-y-conducta", "microbioma", "dolor",
        "ambiente-y-exposición", "medicación-y-fármacos",
        "diagnóstico-y-clasificación", "hormonas-y-endocrino",
        "inmunidad", "envejecimiento"
      ],
    },
    {
      type: "datetime" as const,
      name: "fecha",
      label: "Fecha",
      required: true,
    },
    {
      type: "string" as const,
      name: "resumen",
      label: "Resumen",
      required: true,
      ui: { component: "textarea" },
    },
    {
      type: "rich-text" as const,
      name: "body",
      label: "Contenido",
      isBody: true,
    },
  ];
}
