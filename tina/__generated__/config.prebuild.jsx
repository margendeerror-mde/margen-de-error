// tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "dummy-id",
  token: process.env.TINA_TOKEN || "dummy-token",
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
        format: "md",
        ui: {
          filename: {
            slugify: (values) => values?.titulo?.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "") || ""
          }
        },
        fields: camposComunes()
      },
      {
        name: "conflictos",
        label: "Conflictos",
        path: "content/conflictos",
        format: "md",
        ui: {
          filename: {
            slugify: (values) => values?.titulo?.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "") || ""
          }
        },
        fields: camposComunes()
      },
      {
        name: "serendipia",
        label: "Serendipia",
        path: "content/serendipia",
        format: "md",
        ui: {
          filename: {
            slugify: (values) => values?.titulo?.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "") || ""
          }
        },
        fields: camposComunes()
      },
      {
        name: "analisis",
        label: "An\xE1lisis",
        path: "content/analisis",
        format: "md",
        ui: {
          filename: {
            slugify: (values) => values?.titulo?.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "") || ""
          }
        },
        fields: camposComunes()
      },
      {
        name: "marco",
        label: "Marco",
        path: "content/marco",
        format: "md",
        ui: {
          filename: {
            slugify: (values) => values?.titulo?.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "") || ""
          }
        },
        fields: camposComunes()
      }
    ]
  }
});
function camposComunes() {
  return [
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
      options: ["historia", "conflicto", "serendipia", "an\xE1lisis", "marco"]
    },
    {
      type: "string",
      name: "industria",
      label: "Industria",
      required: true,
      options: [
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
      ]
    },
    {
      type: "string",
      name: "mecanismo",
      label: "Mecanismo",
      list: true,
      options: [
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
      ]
    },
    {
      type: "string",
      name: "tema",
      label: "Tema",
      required: true,
      options: [
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
      ]
    },
    {
      type: "datetime",
      name: "fecha",
      label: "Fecha",
      required: true
    },
    {
      type: "string",
      name: "resumen",
      label: "Resumen",
      required: true,
      ui: { component: "textarea" }
    },
    {
      type: "rich-text",
      name: "body",
      label: "Contenido",
      isBody: true
    }
  ];
}
export {
  config_default as default
};
