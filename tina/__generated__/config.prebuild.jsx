// tina/config.ts
import { defineConfig } from "tinacms";

// lib/types.ts
var INDUSTRIAS = [
  "farmac\xE9utica",
  "alimentaria",
  "cosm\xE9tica-y-cuidado-personal",
  "tabaco",
  "alcohol",
  "suplementos-y-bienestar",
  "dispositivos-m\xE9dicos",
  "seguros-de-salud",
  "agroqu\xEDmica",
  "energ\xEDa",
  "institucional-acad\xE9mica",
  "organismos-reguladores",
  "medios-y-comunicaci\xF3n"
];
var MECANISMOS = [
  "financiamiento-de-estudio",
  "dise\xF1o-sesgado",
  "titular-enga\xF1oso",
  "omisi\xF3n-de-datos",
  "cherry-picking",
  "captura-regulatoria",
  "migraci\xF3n-de-estrategia",
  "conflicto-de-inter\xE9s-no-declarado",
  "sesgo-de-publicaci\xF3n",
  "experto-capturado",
  "manufactura-de-duda",
  "normalizaci\xF3n-por-repetici\xF3n",
  "correlaci\xF3n-presentada-como-causalidad"
];
var TEMAS = [
  "luz-y-radiaci\xF3n",
  "nutrici\xF3n",
  "movimiento-y-ejercicio",
  "sue\xF1o",
  "mente-y-conducta",
  "microbioma",
  "dolor",
  "ambiente-y-exposici\xF3n",
  "medicaci\xF3n-y-f\xE1rmacos",
  "diagn\xF3stico-y-clasificaci\xF3n",
  "hormonas-y-endocrino",
  "inmunidad",
  "envejecimiento"
];

// tina/config.ts
var branch = "main";
var config_default = defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
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
  schema: {
    collections: [
      {
        name: "historias",
        label: "Historias",
        path: "content/historias",
        format: "mdx",
        ui: {
          filename: {
            slugify: (values) => `${values?.titulo?.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "") || "sin-titulo"}`
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
            slugify: (values) => `${values?.titulo?.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "") || "sin-titulo"}`
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
            slugify: (values) => `${values?.titulo?.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "") || "sin-titulo"}`
          }
        },
        fields: getFields("serendipia")
      },
      {
        name: "analisis",
        label: "An\xE1lisis",
        path: "content/analisis",
        format: "mdx",
        ui: {
          filename: {
            slugify: (values) => `${values?.titulo?.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "") || "sin-titulo"}`
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
            slugify: (values) => `${values?.titulo?.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "") || "sin-titulo"}`
          }
        },
        fields: getFields("marco")
      }
    ]
  }
});
function getFields(seccionName) {
  return [
    { type: "string", name: "titulo", label: "T\xEDtulo", isTitle: true, required: true },
    { type: "string", name: "seccion", label: "Secci\xF3n", required: true, ui: { component: "hidden" } },
    // Will be set automatically or hidden
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
    { type: "rich-text", name: "body", label: "Contenido de la Pieza", isBody: true }
  ];
}
export {
  config_default as default
};
