/**
 * Script de migración de frontmatters al nuevo Atlas del Error.
 * 
 * Ejecutar con: node scripts/migrate-atlas.mjs
 * 
 * Este script:
 * 1. Lee cada archivo .md en content/
 * 2. Añade los campos `atlas`, `pregunta` y `condiciones` al frontmatter
 * 3. Mantiene los campos existentes intactos (backward compatible)
 * 4. Escribe el archivo de vuelta
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// ============================================================
// MAPPING: cada archivo → atlas + pregunta + condiciones
// ============================================================
const MIGRATION_MAP = {
  // ── HISTORIAS ──
  'historias/manufactura-de-duda.md': {
    atlas: ['manufactura-de-duda'],
    pregunta: '¿Cómo se frena la acción cuando la evidencia ya es abrumadora?',
    condiciones: ['lobby-industrial', 'financiamiento-oscuro'],
  },
  'historias/el-experimento-de-las-siete-naciones.md': {
    atlas: ['cherry-picking'],
    pregunta: '¿Qué pasa cuando elegimos solamente los datos que confirman nuestra hipótesis?',
    condiciones: ['autoridad-científica'],
  },
  'historias/el-hombre-que-llego-primero.md': {
    atlas: ['inercia-institucional'],
    pregunta: '¿Qué pasa cuando la evidencia correcta pierde contra la narrativa dominante?',
    condiciones: ['conflicto-de-interés', 'financiamiento-industrial'],
  },
  'historias/cinco-lineas.md': {
    atlas: ['cherry-picking', 'sobreinterpretación'],
    pregunta: '¿Qué pasa cuando una carta al editor se convierte en evidencia científica?',
    condiciones: ['incentivos-académicos'],
  },
  'historias/el-numero-que-nos-mide.md': {
    atlas: ['sobreinterpretación', 'endpoints-subrogados'],
    pregunta: '¿Qué sucede cuando un indicador estadístico para poblaciones se aplica a individuos?',
    condiciones: ['captura-regulatoria'],
  },
  'historias/la-luz-que-nos-falta.md': {
    atlas: ['causalidad-inversa', 'confusión'],
    pregunta: '¿Qué pasa cuando confundimos los síntomas de un problema con su causa?',
    condiciones: ['especialización-fragmentada'],
  },

  // ── CONFLICTOS ──
  'conflictos/coca-cola-y-el-sedentarismo.md': {
    atlas: ['manufactura-de-duda'],
    pregunta: '¿Qué ocurre cuando una industria elige qué parte de la ciencia financiar?',
    condiciones: ['financiamiento-industrial', 'conflicto-de-interés'],
  },
  'conflictos/los-autores-que-no-escribieron.md': {
    atlas: ['manufactura-de-duda'],
    pregunta: '¿Qué pasa cuando los autores de un paper no lo escribieron?',
    condiciones: ['conflicto-de-interés', 'financiamiento-industrial'],
  },
  'conflictos/los-datos-que-no-viajaron.md': {
    atlas: ['sesgo-de-publicación'],
    pregunta: '¿Qué pasa cuando los estudios negativos nunca llegan a publicarse?',
    condiciones: ['conflicto-de-interés'],
  },
  'conflictos/protector-solar.md': {
    atlas: ['sobreinterpretación', 'endpoints-subrogados'],
    pregunta: '¿Qué ocurre cuando un producto se evalúa midiendo un marcador y no un resultado clínico?',
    condiciones: [],
  },

  // ── ANÁLISIS ──
  'analisis/estudio-pure.md': {
    atlas: ['límite-observacional', 'sobreinterpretación'],
    pregunta: '¿Qué puede decir realmente un estudio observacional, por más grande que sea?',
    condiciones: [],
  },
  'analisis/cuestionarios-alimentarios.md': {
    atlas: ['límite-observacional'],
    pregunta: '¿Puede un cuestionario medir con precisión lo que una persona comió?',
    condiciones: ['incentivos-académicos'],
  },
  'analisis/ldl-mortalidad-mayores.md': {
    atlas: ['confusión', 'sobreinterpretación'],
    pregunta: '¿Qué puede concluir realmente una revisión de estudios observacionales?',
    condiciones: [],
  },
  'analisis/cuando-bajar-el-numero-mato-gente.md': {
    atlas: ['endpoints-subrogados'],
    pregunta: '¿Qué pasa cuando tratar el marcador empeora al paciente?',
    condiciones: [],
  },

  // ── SERENDIPIA ──
  'serendipia/helicobacter.md': {
    atlas: ['inercia-institucional'],
    pregunta: '¿Qué pasa cuando la evidencia contradice el consenso?',
    condiciones: [],
  },
  'serendipia/el-litio-y-las-cobayas.md': {
    atlas: ['inercia-institucional'],
    pregunta: '¿Qué pasa cuando un descubrimiento accidental desafía las prioridades de la industria?',
    condiciones: [],
  },
  'serendipia/la-pastilla-del-corazon.md': {
    atlas: ['endpoints-subrogados'],
    pregunta: '¿Qué pasa cuando el efecto secundario es más importante que el efecto buscado?',
    condiciones: [],
  },
  'serendipia/la-queja-que-valia-millones.md': {
    atlas: ['endpoints-subrogados'],
    pregunta: '¿Qué ocurre cuando un efecto adverso se convierte en la indicación principal?',
    condiciones: [],
  },

  // ── MARCO ──
  'marco/cuando-el-diseno-es-tambien-la-conclusion.md': {
    atlas: ['p-hacking', 'confusión'],
    pregunta: '¿Puede el diseño de un estudio predeterminar su conclusión?',
    condiciones: ['incentivos-académicos'],
  },
  'marco/cuando-la-ciencia-intento-verificarse-a-si-misma.md': {
    atlas: ['sesgo-de-publicación', 'p-hacking'],
    pregunta: '¿Qué pasa cuando se intenta repetir los hallazgos más influyentes?',
    condiciones: ['incentivos-académicos'],
  },
  'marco/el-problema-del-endpoint.md': {
    atlas: ['endpoints-subrogados'],
    pregunta: '¿Qué pasa cuando un ensayo clínico mide un número y no una vida?',
    condiciones: ['captura-regulatoria'],
  },
  'marco/el-problema-del-p.md': {
    atlas: ['p-hacking', 'baja-potencia-estadística'],
    pregunta: '¿Qué pasa cuando una convención estadística se convierte en el árbitro de la verdad?',
    condiciones: ['incentivos-académicos'],
  },
  'marco/la-diferencia-entre-ver-y-encontrar.md': {
    atlas: ['baja-potencia-estadística'],
    pregunta: '¿Cuándo un estudio es demasiado pequeño para encontrar algo y demasiado grande para que importe?',
    condiciones: ['incentivos-académicos'],
  },
  'marco/la-mitad-siempre-convence.md': {
    atlas: ['sobreinterpretación'],
    pregunta: '¿Qué pasa cuando el mismo dato se presenta de dos formas y una siempre convence más?',
    condiciones: [],
  },

  // ── PODCAST (mirror articles - inherit atlas from parent article) ──
  'podcast/la-duda-fue-el-producto.md': {
    atlas: ['manufactura-de-duda'],
    pregunta: '¿Cómo se frena la acción cuando la evidencia ya es abrumadora?',
    condiciones: ['lobby-industrial', 'financiamiento-oscuro'],
  },
  'podcast/la-asimetria-de-la-evidencia.md': {
    atlas: ['límite-observacional', 'sobreinterpretación'],
    pregunta: '¿Qué puede decir realmente un estudio observacional, por más grande que sea?',
    condiciones: [],
  },
  'podcast/cuando-el-diseno-es-tambien-la-conclusion.md': {
    atlas: ['p-hacking', 'confusión'],
    pregunta: '¿Puede el diseño de un estudio predeterminar su conclusión?',
    condiciones: ['incentivos-académicos'],
  },
  'podcast/cinco-lineas.md': {
    atlas: ['cherry-picking', 'sobreinterpretación'],
    pregunta: '¿Qué pasa cuando una carta al editor se convierte en evidencia científica?',
    condiciones: ['incentivos-académicos'],
  },
  'podcast/la-evidencia-invisible.md': {
    atlas: ['sesgo-de-publicación'],
    pregunta: '¿Qué pasa cuando los estudios negativos nunca llegan a publicarse?',
    condiciones: ['conflicto-de-interés'],
  },
  'podcast/cuando-la-ciencia-intento-verificarse-a-si-misma.md': {
    atlas: ['sesgo-de-publicación', 'p-hacking'],
    pregunta: '¿Qué pasa cuando se intenta repetir los hallazgos más influyentes?',
    condiciones: ['incentivos-académicos'],
  },
  'podcast/la-diferencia-entre-ver-y-encontrar.md': {
    atlas: ['baja-potencia-estadística'],
    pregunta: '¿Cuándo un estudio es demasiado pequeño para encontrar algo y demasiado grande para que importe?',
    condiciones: ['incentivos-académicos'],
  },
  'podcast/el-problema-del-p-menor-a-005.md': {
    atlas: ['p-hacking', 'baja-potencia-estadística'],
    pregunta: '¿Qué pasa cuando una convención estadística se convierte en el árbitro de la verdad?',
    condiciones: ['incentivos-académicos'],
  },
};

// ============================================================
// MIGRATION LOGIC
// ============================================================

const contentDir = path.join(process.cwd(), 'content');
let migrated = 0;
let skipped = 0;
let errors = 0;

for (const [relPath, newFields] of Object.entries(MIGRATION_MAP)) {
  const fullPath = path.join(contentDir, relPath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  SKIP (not found): ${relPath}`);
    skipped++;
    continue;
  }

  try {
    const raw = fs.readFileSync(fullPath, 'utf-8');
    const { data, content } = matter(raw);

    // Add new fields
    data.atlas = newFields.atlas;
    data.pregunta = newFields.pregunta;
    data.condiciones = newFields.condiciones;

    // Rebuild the file
    const updated = matter.stringify(content, data);
    fs.writeFileSync(fullPath, updated, 'utf-8');

    console.log(`✅ ${relPath}`);
    migrated++;
  } catch (err) {
    console.error(`❌ ERROR: ${relPath} — ${err.message}`);
    errors++;
  }
}

console.log('\n──────────────────────────────');
console.log(`Migrated: ${migrated}`);
console.log(`Skipped:  ${skipped}`);
console.log(`Errors:   ${errors}`);
console.log(`Total:    ${migrated + skipped + errors}`);
