'use client';

import React, { useState } from 'react';

/*
 * Data sources:
 * - Keys A. "Atherosclerosis: a problem in newer public health." 1953.
 * - Yerushalmy J, Hilleboe HE. "Fat in the diet and mortality from heart disease." 1957.
 * 
 * The 1953 graph used 6 countries (not 7). The formal Seven Countries Study (1970)
 * was a different, larger, longitudinal study. The "22 countries" data comes from
 * Yerushalmy & Hilleboe's 1957 reanalysis using FAO statistics available at the time.
 * 
 * Coordinates below are approximate representations for educational purposes.
 * X = % calories from fat, Y = CHD deaths per 1000 men (age-standardized).
 */

// The 6 countries Keys used in his 1953 graph (often cited as 7)
const keysCountries = [
  { x: 7,  y: 5,   label: 'Japón' },
  { x: 20, y: 9,   label: 'Italia' },
  { x: 25, y: 17,  label: 'Inglaterra' },
  { x: 33, y: 24,  label: 'Australia' },
  { x: 35, y: 25,  label: 'Canadá' },
  { x: 40, y: 30,  label: 'EE.UU.' },
];

// Additional countries from the Yerushalmy & Hilleboe 1957 dataset 
// that weaken or break the neat correlation
const additionalCountries = [
  { x: 38, y: 6,  label: 'Francia' },
  { x: 19, y: 25, label: 'Finlandia' },
  { x: 28, y: 7,  label: 'Austria' },
  { x: 30, y: 8,  label: 'Suiza' },
  { x: 32, y: 10, label: 'Alemania' },
  { x: 22, y: 22, label: 'Irlanda' },
  { x: 15, y: 19, label: 'Portugal' },
  { x: 24, y: 12, label: 'Noruega' },
  { x: 36, y: 11, label: 'Dinamarca' },
  { x: 34, y: 14, label: 'Suecia' },
  { x: 27, y: 20, label: 'Países Bajos' },
  { x: 26, y: 5,  label: 'Israel' },
  { x: 10, y: 15, label: 'Chile' },
  { x: 13, y: 3,  label: 'Ceilán' },
  { x: 16, y: 8,  label: 'México' },
  { x: 30, y: 28, label: 'Nueva Zelanda' },
];

// Chart coordinate system
const PADDING = { top: 8, right: 8, bottom: 14, left: 14 };
const CHART_W = 100;
const CHART_H = 100;

function mapX(val: number) {
  return PADDING.left + ((val / 50) * (CHART_W - PADDING.left - PADDING.right));
}
function mapY(val: number) {
  return (CHART_H - PADDING.bottom) - ((val / 35) * (CHART_H - PADDING.top - PADDING.bottom));
}

// Simple linear regression for trend line
function trendLine(points: { x: number; y: number }[]) {
  const n = points.length;
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

export default function SevenCountriesChart() {
  const [showAll, setShowAll] = useState(false);

  const keysTrend = trendLine(keysCountries);
  const allTrend = trendLine([...keysCountries, ...additionalCountries]);

  const trendToUse = showAll ? allTrend : keysTrend;

  // Draw trend line from x=2 to x=48
  const tLineX1 = mapX(2);
  const tLineY1 = mapY(trendToUse.slope * 2 + trendToUse.intercept);
  const tLineX2 = mapX(48);
  const tLineY2 = mapY(trendToUse.slope * 48 + trendToUse.intercept);

  return (
    <div className="my-12 not-prose">
      <div className="p-6 md:p-8 bg-white border border-[#E5E5E5] rounded-xl shadow-sm font-sans relative overflow-hidden">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-[#0A0A0A] mb-1 leading-tight">
              Grasa en la dieta vs. mortalidad coronaria
            </h3>
            <p className="text-xs md:text-sm text-[#737373]">
              Muertes por enf. coronarias / 1000 hombres · Datos aprox. 1953–1957
            </p>
          </div>
          <button 
            onClick={() => setShowAll(!showAll)}
            className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
              showAll 
                ? 'bg-[#0A0A0A] text-white hover:bg-neutral-800' 
                : 'bg-[#CC0000] text-white hover:bg-red-700 shadow-md'
            }`}
          >
            {showAll ? '← Volver a los 6 países' : 'Revelar los 22 países →'}
          </button>
        </div>

        {/* SVG Chart Area */}
        <div className="relative w-full bg-[#FAFAF8] rounded-lg border border-[#E5E5E5]">
          
          {/* Y Axis Label */}
          <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] md:text-[10px] text-[#999] font-medium tracking-wider uppercase whitespace-nowrap">
            Mortalidad coronaria →
          </div>
          
          {/* X Axis Label */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] text-[#999] font-medium tracking-wider uppercase whitespace-nowrap">
            % calorías de grasa →
          </div>

          <svg viewBox="0 0 100 100" className="w-full overflow-visible" style={{ aspectRatio: '16/10' }}>
            
            {/* Grid lines */}
            {[7, 14, 21, 28, 35].map(v => (
              <line key={`grid-${v}`} x1={PADDING.left} y1={mapY(v)} x2={CHART_W - PADDING.right} y2={mapY(v)} stroke="#E8E8E8" strokeWidth="0.3" />
            ))}
            {[10, 20, 30, 40].map(v => (
              <line key={`gridx-${v}`} x1={mapX(v)} y1={PADDING.top} x2={mapX(v)} y2={CHART_H - PADDING.bottom} stroke="#E8E8E8" strokeWidth="0.3" />
            ))}
            
            {/* Axes */}
            <line x1={PADDING.left} y1={CHART_H - PADDING.bottom} x2={CHART_W - PADDING.right} y2={CHART_H - PADDING.bottom} stroke="#0A0A0A" strokeWidth="0.5" />
            <line x1={PADDING.left} y1={PADDING.top} x2={PADDING.left} y2={CHART_H - PADDING.bottom} stroke="#0A0A0A" strokeWidth="0.5" />

            {/* Axis tick labels */}
            {[0, 10, 20, 30, 40, 50].map(v => (
              <text key={`xtick-${v}`} x={mapX(v)} y={CHART_H - PADDING.bottom + 4} fontSize="2.5" fill="#999" textAnchor="middle">{v}%</text>
            ))}
            {[0, 7, 14, 21, 28, 35].map(v => (
              <text key={`ytick-${v}`} x={PADDING.left - 1.5} y={mapY(v) + 0.8} fontSize="2.5" fill="#999" textAnchor="end">{v}</text>
            ))}

            {/* Trend line — computed via linear regression, follows the dots */}
            <line 
              x1={tLineX1} y1={tLineY1}
              x2={tLineX2} y2={tLineY2}
              stroke={showAll ? '#A3A3A3' : '#CC0000'}
              strokeWidth={showAll ? '0.5' : '1'}
              strokeDasharray="3 2"
              className="transition-all duration-1000"
            />

            {/* Additional Points (revealed) */}
            {additionalCountries.map((pt, i) => {
              const cx = mapX(pt.x);
              const cy = mapY(pt.y);
              return (
                <g 
                  key={`extra-${i}`} 
                  style={{ 
                    opacity: showAll ? 1 : 0, 
                    transition: `opacity 0.5s ease ${showAll ? i * 40 : 0}ms, transform 0.5s ease ${showAll ? i * 40 : 0}ms`,
                    transform: showAll ? 'scale(1)' : 'scale(0.3)',
                    transformOrigin: `${cx}px ${cy}px`
                  }}
                >
                  <circle cx={cx} cy={cy} r="1.4" fill="#A3A3A3" />
                  <text x={cx} y={cy - 2.5} fontSize="2" fill="#737373" textAnchor="middle" fontWeight="500">
                    {pt.label}
                  </text>
                </g>
              );
            })}

            {/* Keys' 6 Countries (always visible) */}
            {keysCountries.map((pt, i) => {
              const cx = mapX(pt.x);
              const cy = mapY(pt.y);
              return (
                <g key={`keys-${i}`}>
                  <circle cx={cx} cy={cy} r="1.8" fill="#0A0A0A" className="transition-all duration-500" />
                  <text 
                    x={cx} y={cy - 3} 
                    fontSize="2.5" fill="#0A0A0A" textAnchor="middle" fontWeight="600"
                    style={{ opacity: showAll ? 0.4 : 1, transition: 'opacity 0.5s ease' }}
                  >
                    {pt.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend + Contextual Note — BELOW the chart */}
        <div className="mt-4 flex flex-col md:flex-row gap-4 items-start justify-between">
          
          {/* Legend */}
          <div className="flex gap-6 items-center text-xs text-[#737373]">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#0A0A0A]"></span>
              Países seleccionados por Keys (1953)
            </span>
            <span className={`flex items-center gap-1.5 transition-opacity duration-500 ${showAll ? 'opacity-100' : 'opacity-0'}`}>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#A3A3A3]"></span>
              Países omitidos (Yerushalmy & Hilleboe, 1957)
            </span>
          </div>
        </div>

        {/* Contextual annotation — appears below */}
        <div className={`mt-4 p-4 bg-[#F5F5F0] border border-[#E5E5E0] rounded-lg transition-all duration-700 ${showAll ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden p-0 mt-0 border-0'}`}>
          <p className="text-sm text-[#444] leading-relaxed">
            <strong className="text-[#0A0A0A]">¿Por qué importa esto?</strong> Al incluir los 22 países disponibles, la correlación se debilita significativamente. Países como <strong>Francia</strong> (alto consumo de grasa, baja mortalidad) o <strong>Finlandia</strong> (bajo consumo de grasa, alta mortalidad) contradicen la tendencia lineal que el gráfico original sugería.
          </p>
          <p className="text-xs text-[#888] mt-3 leading-relaxed">
            <strong>Nota editorial:</strong> Defensores del estudio señalan que la confusión entre el gráfico de 1953 (6 países) y el Estudio formal de los Siete Países (1970, longitudinal, con metodología más robusta) es frecuente. El propio Keys argumentó que no todos los datos eran comparables. Este gráfico representa el debate, no una conclusión cerrada. 
            <a href="https://www.sevencountriesstudy.com/about-the-study/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0A0A0A] transition-colors ml-1">Fuente oficial del estudio →</a>
          </p>
        </div>
      </div>
    </div>
  );
}
