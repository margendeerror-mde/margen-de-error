// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  // Get this from tina.io
  ...process.env.NEXT_PUBLIC_TINA_CLIENT_ID && { clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID },
  // Get this from tina.io
  ...process.env.TINA_TOKEN && { token: process.env.TINA_TOKEN },
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public"
    }
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "Art\xEDculos",
        path: "content",
        match: {
          include: "**/*"
        },
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "titulo",
            label: "T\xEDtulo",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "seccion",
            label: "Secci\xF3n",
            required: true,
            options: [
              { label: "Historias", value: "historias" },
              { label: "Conflictos", value: "conflictos" },
              { label: "Serendipia", value: "serendipia" },
              { label: "An\xE1lisis", value: "analisis" },
              { label: "Marco", value: "marco" }
            ]
          },
          {
            type: "string",
            name: "industria",
            label: "Industria",
            options: [
              { label: "Farmac\xE9utica", value: "farmac\xE9utica" },
              { label: "Alimentaria", value: "alimentaria" },
              { label: "Cosm\xE9tica", value: "cosm\xE9tica" },
              { label: "Tabaco", value: "tabaco" },
              { label: "Energ\xEDa", value: "energ\xEDa" },
              { label: "Institucional", value: "institucional" },
              { label: "Acad\xE9mica", value: "acad\xE9mica" }
            ]
          },
          {
            type: "string",
            name: "mecanismo",
            label: "Mecanismos",
            list: true,
            options: [
              { label: "Financiamiento", value: "financiamiento" },
              { label: "Dise\xF1o de estudio", value: "dise\xF1o de estudio" },
              { label: "Titular enga\xF1oso", value: "titular enga\xF1oso" },
              { label: "Omisi\xF3n", value: "omisi\xF3n" },
              { label: "Migraci\xF3n de estrategia", value: "migraci\xF3n de estrategia" },
              { label: "Conflicto de inter\xE9s", value: "conflicto de inter\xE9s" },
              { label: "Captura regulatoria", value: "captura regulatoria" }
            ]
          },
          {
            type: "datetime",
            name: "fecha",
            label: "Fecha",
            required: true,
            ui: {
              dateFormat: "YYYY-MM-DD"
            }
          },
          {
            type: "string",
            name: "resumen",
            label: "Resumen",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "rich-text",
            name: "body",
            label: "Cuerpo del art\xEDculo",
            isBody: true
          }
        ],
        ui: {
          filename: {
            // El slug se genera a partir del título si no se provee
            slugify: (values) => {
              return `${values?.titulo?.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") || "sin-titulo"}`;
            }
          }
        }
      }
    ]
  }
});
export {
  config_default as default
};
