import { defineConfig } from "tinacms";
import { INDUSTRIAS, MECANISMOS, TEMAS } from "../lib/types";

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
        name: "historias",
        label: "Historias",
        path: "content/historias",
        format: "mdx",
        ui: {
          filename: {
            slugify: (values) => `${values?.titulo?.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '') || 'sin-titulo'}`
          }
        },
        fields: getFields("historias")
      },
      {
        name: "conflictos",
        label: "Conflictos",
        path: "content/conflictos",
        format: "mdx",
        ui: {
          filename: {
            slugify: (values) => `${values?.titulo?.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '') || 'sin-titulo'}`
          }
        },
        fields: getFields("conflictos")
      },
      {
        name: "serendipia",
        label: "Serendipia",
        path: "content/serendipia",
        format: "mdx",
        ui: {
          filename: {
            slugify: (values) => `${values?.titulo?.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '') || 'sin-titulo'}`
          }
        },
        fields: getFields("serendipia")
      },
      {
        name: "analisis",
        label: "Análisis",
        path: "content/analisis",
        format: "mdx",
        ui: {
          filename: {
            slugify: (values) => `${values?.titulo?.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '') || 'sin-titulo'}`
          }
        },
        fields: getFields("analisis")
      },
      {
        name: "marco",
        label: "Marco",
        path: "content/marco",
        format: "mdx",
        ui: {
          filename: {
            slugify: (values) => `${values?.titulo?.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '') || 'sin-titulo'}`
          }
        },
        fields: getFields("marco")
      }
    ],
  },
});

function getFields(seccionName: string): any[] {
  return [
    { type: "string", name: "titulo", label: "Título", isTitle: true, required: true },
    { type: "string", name: "seccion", label: "Sección", required: true, ui: { component: "hidden" } }, // Will be set automatically or hidden
    { 
      type: "string", 
      name: "industria", 
      label: "Industria", 
      required: true,
      options: [...INDUSTRIAS]
    },
    { 
      type: "string", 
      name: "mecanismo", 
      label: "Mecanismo(s)", 
      required: true,
      list: true,
      options: [...MECANISMOS]
    },
    { 
      type: "string", 
      name: "tema", 
      label: "Tema", 
      required: true,
      options: [...TEMAS]
    },
    { type: "datetime", name: "fecha", label: "Fecha", required: true },
    { type: "string", name: "resumen", label: "Resumen Breve", ui: { component: "textarea" }, required: true },
    { type: "rich-text", name: "body", label: "Contenido de la Pieza", isBody: true },
  ];
}
