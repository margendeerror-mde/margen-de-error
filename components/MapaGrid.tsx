'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PiezaMeta, INDUSTRIAS, MECANISMOS } from '@/lib/types';
import TagBadge from './TagBadge';

export default function MapaGrid({ piezas }: { piezas: PiezaMeta[] }) {
  const [selectedCell, setSelectedCell] = useState<{ industria: string; mecanismo: string } | null>(null);

  // Compute intersections
  const intersectionData = INDUSTRIAS.map(industria => {
    return {
      industria,
      mecanismos: MECANISMOS.map(mecanismo => {
        const matchingPiezas = piezas.filter(p => 
          p.industria === industria && p.mecanismo.includes(mecanismo)
        );
        return {
          mecanismo,
          piezas: matchingPiezas,
          count: matchingPiezas.length
        };
      })
    };
  });

  const maxCount = Math.max(1, ...intersectionData.flatMap(row => row.mecanismos.map(m => m.count)));

  return (
    <div className="flex flex-col gap-12">
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[700px] md:min-w-[800px]">
          {/* Header row (Mecanismos) */}
          <div className="flex mb-2">
            <div className="w-32 md:w-48 shrink-0"></div> {/* Empty corner */}
            {MECANISMOS.map(m => (
              <div key={m} className="flex-1 px-1 text-center flex flex-col justify-end items-center h-32 md:h-40 mb-2">
                <span className="text-[10px] md:text-xs uppercase tracking-wider text-muted [writing-mode:vertical-rl] transform rotate-180">
                  {m}
                </span>
              </div>
            ))}
          </div>

          {/* Rows (Industrias) */}
          {intersectionData.map(row => (
            <div key={row.industria} className="flex mb-1 items-center">
              <div className="w-32 md:w-48 shrink-0 text-right pr-4 md:pr-6">
                <span className="text-[10px] md:text-sm uppercase tracking-wider text-foreground font-medium">
                  {row.industria}
                </span>
              </div>
              
              {row.mecanismos.map(cell => {
                const intensity = cell.count > 0 ? 0.3 + (cell.count / maxCount) * 0.7 : 0;
                const isSelected = selectedCell?.industria === row.industria && selectedCell?.mecanismo === cell.mecanismo;
                
                return (
                  <div key={`${row.industria}-${cell.mecanismo}`} className="flex-1 px-[2px]">
                    <button
                      onClick={() => setSelectedCell(isSelected ? null : { industria: row.industria, mecanismo: cell.mecanismo })}
                      disabled={cell.count === 0}
                      className={`w-full aspect-square border transition-all flex items-center justify-center ${
                        cell.count === 0 
                          ? 'border-border/40 bg-transparent cursor-not-allowed' 
                          : isSelected
                            ? 'border-foreground ring-2 ring-foreground ring-offset-2 ring-offset-background'
                            : 'border-accent/20 hover:border-accent cursor-pointer'
                      }`}
                      style={{
                        backgroundColor: cell.count > 0 ? `rgba(194, 59, 34, ${intensity})` : 'transparent',
                      }}
                      title={`${row.industria} + ${cell.mecanismo}: ${cell.count} piezas`}
                    >
                      <span className="sr-only">{cell.count} piezas</span>
                      {cell.count > 0 && (
                        <span className={`text-xs md:text-sm font-mono ${intensity > 0.6 ? 'text-background' : 'text-foreground'}`}>
                          {cell.count}
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Cell Details */}
      {selectedCell && (
        <div className="p-6 md:p-10 border-2 border-foreground bg-background rounded-sm animate-in slide-in-from-top-4 duration-300 shadow-sm">
          <div className="flex flex-wrap gap-3 mb-8 items-center border-b border-border pb-6">
            <span className="text-sm text-muted uppercase tracking-wider">Mostrando:</span>
            <TagBadge tipo="industria" valor={selectedCell.industria} />
            <span className="text-muted">+</span>
            <TagBadge tipo="mecanismo" valor={selectedCell.mecanismo} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {intersectionData
              .find(r => r.industria === selectedCell.industria)
              ?.mecanismos.find(m => m.mecanismo === selectedCell.mecanismo)
              ?.piezas.map(pieza => (
                <Link 
                  key={pieza.slug} 
                  href={`/${pieza.seccion}/${pieza.slug}`}
                  className="group block p-6 border border-border hover:border-accent transition-colors bg-background relative"
                >
                  <TagBadge tipo="seccion" valor={pieza.seccion} className="mb-4" />
                  <h4 className="font-serif text-2xl text-foreground group-hover:text-accent transition-colors mb-3 leading-tight">
                    {pieza.titulo}
                  </h4>
                  <p className="text-muted text-sm line-clamp-3 leading-relaxed">
                    {pieza.resumen}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
