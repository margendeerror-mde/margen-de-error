import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
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
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "Artículos",
        path: "content",
        match: {
          include: "**/*",
        },
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
            options: [
              { label: "Historias", value: "historias" },
              { label: "Conflictos", value: "conflictos" },
              { label: "Serendipia", value: "serendipia" },
              { label: "Análisis", value: "analisis" },
              { label: "Marco", value: "marco" },
            ],
          },
          {
            type: "string",
            name: "industria",
            label: "Industria",
            options: [
              { label: "Farmacéutica", value: "farmacéutica" },
              { label: "Alimentaria", value: "alimentaria" },
              { label: "Cosmética", value: "cosmética" },
              { label: "Tabaco", value: "tabaco" },
              { label: "Energía", value: "energía" },
              { label: "Institucional", value: "institucional" },
              { label: "Académica", value: "académica" },
            ],
          },
          {
            type: "string",
            name: "mecanismo",
            label: "Mecanismos",
            list: true,
            options: [
              { label: "Financiamiento", value: "financiamiento" },
              { label: "Diseño de estudio", value: "diseño de estudio" },
              { label: "Titular engañoso", value: "titular engañoso" },
              { label: "Omisión", value: "omisión" },
              { label: "Migración de estrategia", value: "migración de estrategia" },
              { label: "Conflicto de interés", value: "conflicto de interés" },
              { label: "Captura regulatoria", value: "captura regulatoria" },
            ],
          },
          {
            type: "datetime",
            name: "fecha",
            label: "Fecha",
            required: true,
            ui: {
              dateFormat: 'YYYY-MM-DD',
            },
          },
          {
            type: "string",
            name: "resumen",
            label: "Resumen",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "rich-text",
            name: "body",
            label: "Cuerpo del artículo",
            isBody: true,
          },
        ],
        ui: {
          filename: {
            // El slug se genera a partir del título si no se provee
            slugify: (values) => {
              return `${values?.titulo?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || 'sin-titulo'}`;
            },
          },
        },
      },
    ],
  },
});
