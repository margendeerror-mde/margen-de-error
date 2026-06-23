---
name: mde-interactive-visualization
description: >
  Patrón de diseño para crear visualizaciones interactivas dentro de artículos de Margen de Error.
  Usar cuando un artículo contiene un concepto estadístico, metodológico o de manipulación de datos
  que puede ser demostrado visualmente al lector mediante una interacción directa.
---

# Visualización Interactiva MDE — Patrón de Diseño

## Filosofía Central

Las visualizaciones interactivas de Margen de Error no son infografías decorativas.
Son **demostraciones experienciales** de un concepto. El lector no lee sobre el problema:
lo ve, lo toca y lo entiende con sus propios ojos.

La clave es que el usuario **hace** algo (pulsa un botón, desliza un slider, activa un toggle)
y al hacerlo, el gráfico cambia frente a sus ojos, revelando la distorsión, el sesgo o el
mecanismo que el artículo está describiendo.

## Principios de Diseño

### 1. Dos Estados: La Ilusión → La Revelación
Toda visualización MDE tiene dos estados narrativos:

- **Estado A (La Ilusión):** Lo que el lector vería si solo tuviera acceso a la información
  seleccionada, filtrada o manipulada. Debe verse convincente, limpio, lógico.
- **Estado B (La Revelación):** Los datos completos, el contexto omitido, la variable oculta.
  Al activarse, el gráfico se transforma y la "perfección" del Estado A se desmorona visualmente.

La transición entre ambos estados debe ser suave y animada para que el cerebro del lector
registre el cambio como un evento significativo.

### 2. Tono Visual: Clínico, Sobrio, Premium
- Fondo blanco o marfil (#FAFAF8).
- Tipografía sans-serif pequeña, en grises (#737373, #999).
- Puntos de datos en negro (#0A0A0A) para los datos "oficiales" / seleccionados.
- Puntos de datos en gris (#A3A3A3) para los datos revelados / omitidos.
- Líneas de tendencia en rojo MDE (#CC0000) cuando representan la narrativa construida.
- Líneas de tendencia en gris cuando la correlación se debilita.
- Sin sombras pesadas, sin gradientes, sin bordes gruesos.
- El gráfico debe sentirse como un paper académico interactivo, no como una app de marketing.

### 3. Anotación Editorial Debajo, Nunca Encima
Las notas explicativas NUNCA deben tapar los datos. Se colocan debajo del gráfico
en un bloque que se despliega suavemente al activar la revelación. Incluyen:

- **Párrafo principal:** Explica qué significa visualmente lo que acabás de ver.
- **Nota editorial de equilibrio:** Presenta la defensa o el contraargumento.
  MDE no es panfletario. Siempre se incluye el matiz y, cuando existe, un link
  a la fuente primaria del lado opuesto del debate.

### 4. Precisión Histórica y Conceptual
- Los datos deben estar referenciados (papers, año, autores).
- Si hay confusión histórica frecuente (ej: "6 países vs 7 países vs 22 países"),
  el gráfico debe aclararlo, no perpetuarla.
- Las etiquetas deben reflejar los nombres reales (países, variables, unidades).
- Si un dato es aproximado, debe decirse ("Datos aprox. 1953–1957").

### 5. Interacción Mínima, Impacto Máximo
- Un solo botón o toggle. No menús, no dropdowns, no sliders complicados.
- El texto del botón debe ser una invitación narrativa, no una instrucción técnica:
  - ✅ "Revelar los 22 países →"
  - ✅ "Mostrar los estudios no publicados"
  - ❌ "Toggle dataset completo"
  - ❌ "Click aquí para ver más datos"

### 6. Implementación Técnica
- Componente React con `'use client'` (Client Component en Next.js).
- Gráficos dibujados con **SVG puro** — sin librerías externas (no D3, no Chart.js, no Recharts).
  Esto garantiza carga instantánea y control total de la estética.
- Cálculos estadísticos (regresión lineal, promedios) hechos en el propio componente.
- Registrar el componente en `PiecePage.tsx` dentro del objeto `components` de `MDXRemote`.
- Invocar desde el archivo `.md` del artículo con `<NombreDelComponente />`.
- Colocar el componente en el clímax narrativo del texto (justo después de plantear el problema,
  justo antes de desarrollar las consecuencias).

## Ejemplo de Referencia

El componente `<SevenCountriesChart />` en el artículo "El hombre que eligió siete países"
es el modelo canónico. Demuestra:

- Cherry picking (selección sesgada de datos).
- Regresión lineal que se recalcula en vivo al agregar datos.
- Nota editorial con link a la fuente oficial del estudio.
- Transición animada punto por punto.

## Aplicaciones Futuras (Ideas)

| Artículo | Concepto | Interacción posible |
|---|---|---|
| La evidencia invisible | Sesgo de publicación | Toggle: "Mostrar estudios no publicados" → barras de eficacia se achican |
| El problema del p < 0.05 | P-hacking | Slider que muestra cómo cambia el p-value al modificar parámetros |
| La mitad siempre convence | Riesgo relativo vs absoluto | Toggle: "Ver riesgo absoluto" → el efecto dramático se minimiza |
| Cuando bajar el número mató gente | Umbrales de tratamiento | Slider de umbral → se ilumina cuánta gente "enferma" por definición |
| El estudio que midió lo que la gente recordaba | Recall bias | Comparar lo que la gente dice que comió vs medición objetiva |

## Regla de Oro

> Si el lector puede entender el mecanismo sin leer el artículo completo,
> la visualización cumplió su función.
> Si además quiere seguir leyendo después de interactuar,
> la visualización cumplió su función editorial.
