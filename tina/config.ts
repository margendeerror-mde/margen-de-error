import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.GITHUB_BRANCH || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
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
        name: "pieza",
        label: "Piezas",
        path: "content",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "titulo",
            label: "Título",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "seccion",
            label: "Sección",
            required: true,
            options: ["historia", "conflicto", "serendipia", "análisis", "marco"],
          },
          {
            type: "string",
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
            type: "string",
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
            type: "string",
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
            type: "datetime",
            name: "fecha",
            label: "Fecha",
            required: true,
          },
          {
            type: "string",
            name: "resumen",
            label: "Resumen",
            required: true,
            ui: { component: "textarea" },
          },
          {
            type: "rich-text",
            name: "body",
            label: "Contenido",
            isBody: true,
          },
        ],
      },
    ],
  },
});
