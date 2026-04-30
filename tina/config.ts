import { defineConfig } from "tinacms";

const branch = "main";

export default defineConfig({
  branch,
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
        name: "topic",
        label: "Temas",
        path: "content/topics",
        format: "json",
        fields: [
          { type: "string", name: "name", label: "Nombre", required: true, isTitle: true },
          { type: "string", name: "description", label: "Descripción", ui: { component: "textarea" } },
          { type: "string", name: "related_topic_ids", label: "Temas Relacionados (IDs)", list: true },
        ],
      },
      {
        name: "piece",
        label: "Piezas",
        path: "content/pieces",
        format: "mdx",
        fields: [
          { type: "string", name: "title", label: "Título", isTitle: true, required: true },
          { type: "string", name: "topic_id", label: "Tema (ID)", required: true },
          {
            type: "string",
            name: "format",
            label: "Formato",
            required: true,
            options: [
              { label: "Historia", value: "historia" },
              { label: "Conflicto", value: "conflicto" },
              { label: "Microanálisis", value: "microanalisis" },
            ],
          },
          { type: "string", name: "summary", label: "Resumen", ui: { component: "textarea" } },
          { type: "string", name: "tags", label: "Etiquetas", list: true },
          { type: "rich-text", name: "body", label: "Cuerpo del artículo", isBody: true },
        ],
        ui: {
          filename: {
            slugify: (values) => {
              return `${values?.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || 'sin-titulo'}`;
            },
          },
        },
      },
    ],
  },
});
