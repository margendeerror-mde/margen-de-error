'use client';

import { useState } from 'react';
import { Pieza, ATLAS_COLORS, getAtlasTipo } from '@/lib/types';
import PieceCard from '@/components/PieceCard';

type FilterType = 'distorsión' | 'límite' | 'industria' | 'tema';
type Filter = { tipo: FilterType, valor: string };

export default function AtlasView({ piezas, tags, initialFilter }: { piezas: Pieza[], tags: any, initialFilter?: { tipo: FilterType | null, valor: string | null } }) {
  const [activeFilters, setActiveFilters] = useState<Filter[]>(
    initialFilter && initialFilter.tipo && initialFilter.valor 
      ? [{ tipo: initialFilter.tipo as FilterType, valor: initialFilter.valor }] 
      : []
  );

  const toggleFilter = (tipo: FilterType, valor: string) => {
    setActiveFilters(prev => {
      const exists = prev.some(f => f.tipo === tipo && f.valor === valor);
      if (exists) {
        return prev.filter(f => !(f.tipo === tipo && f.valor === valor));
      }
      return [...prev, { tipo, valor }];
    });
  };

  const isActive = (tipo: FilterType, valor: string) => {
    return activeFilters.some(f => f.tipo === tipo && f.valor === valor);
  };

  const filteredPiezas = piezas.filter(p => {
    if (activeFilters.length === 0) return true;
    
    // Group active filters by type
    const filtersByType = activeFilters.reduce((acc, f) => {
      if (!acc[f.tipo]) acc[f.tipo] = [];
      acc[f.tipo].push(f.valor);
      return acc;
    }, {} as Record<string, string[]>);

    // Must match ALL types that have active filters (AND)
    return Object.entries(filtersByType).every(([tipo, valores]) => {
      // Must match AT LEAST ONE value in this type (OR)
      switch(tipo) {
        case 'distorsión':
        case 'límite':
          return valores.some(v => p.atlas?.includes(v as any));
        case 'industria':
          return valores.includes(p.industria);
        case 'tema':
          return valores.includes(p.tema);
        default:
          return true;
      }
    });
  });

  return (
    <div className="py-12 border-t-2 border-black">
      {/* Botonera Superior Brutalista */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-b-2 border-black">
        
        {/* Distorsiones */}
        <div className="border-r-2 border-black p-6 bg-white">
          <h3 className="font-mono text-xs uppercase tracking-widest font-bold mb-4">DISTORSIONES</h3>
          <div className="flex flex-wrap gap-2">
            {tags.atlas.filter((a: any) => getAtlasTipo(a) === 'distorsión').map((a: string) => (
              <button
                key={a}
                onClick={() => toggleFilter('distorsión', a)}
                className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest transition-colors border-2 border-black ${
                  isActive('distorsión', a)
                    ? 'text-white' 
                    : 'bg-transparent text-black hover:bg-black hover:text-white'
                }`}
                style={{ 
                  backgroundColor: isActive('distorsión', a) ? ATLAS_COLORS['distorsión'] : undefined,
                  borderColor: isActive('distorsión', a) ? ATLAS_COLORS['distorsión'] : 'black',
                }}
              >
                {a.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Límites */}
        <div className="border-r-2 border-black p-6 bg-white">
          <h3 className="font-mono text-xs uppercase tracking-widest font-bold mb-4">LÍMITES</h3>
          <div className="flex flex-wrap gap-2">
            {tags.atlas.filter((a: any) => getAtlasTipo(a) === 'límite').map((a: string) => (
              <button
                key={a}
                onClick={() => toggleFilter('límite', a)}
                className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest transition-colors border-2 border-black ${
                  isActive('límite', a)
                    ? 'text-white' 
                    : 'bg-transparent text-black hover:bg-black hover:text-white'
                }`}
                style={{ 
                  backgroundColor: isActive('límite', a) ? ATLAS_COLORS['límite'] : undefined,
                  borderColor: isActive('límite', a) ? ATLAS_COLORS['límite'] : 'black',
                }}
              >
                {a.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Temas */}
        <div className="border-r-2 border-black p-6 bg-white">
          <h3 className="font-mono text-xs uppercase tracking-widest font-bold mb-4">TEMAS</h3>
          <div className="flex flex-wrap gap-2">
            {tags.tema.map((t: string) => (
              <button
                key={t}
                onClick={() => toggleFilter('tema', t)}
                className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest transition-colors border-2 border-black ${
                  isActive('tema', t)
                    ? 'bg-black text-white' 
                    : 'bg-transparent text-black hover:bg-black hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Industrias */}
        <div className="p-6 bg-white">
          <h3 className="font-mono text-xs uppercase tracking-widest font-bold mb-4">INDUSTRIAS</h3>
          <div className="flex flex-wrap gap-2">
            {tags.industria.map((i: string) => (
              <button
                key={i}
                onClick={() => toggleFilter('industria', i)}
                className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest transition-colors border-2 border-black ${
                  isActive('industria', i)
                    ? 'bg-black text-white' 
                    : 'bg-transparent text-black hover:bg-black hover:text-white'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters Bar */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 border-t-2 border-black p-3 bg-[#F0EDE8] flex justify-end">
          <button 
            onClick={() => setActiveFilters([])}
            disabled={activeFilters.length === 0}
            className={`text-[10px] font-mono font-bold tracking-[0.2em] uppercase flex items-center gap-2 transition-all duration-300 ${
              activeFilters.length > 0 
                ? 'text-black hover:text-accent cursor-pointer' 
                : 'text-black/20 cursor-default'
            }`}
          >
            LIMPIAR FILTROS
            <span className="text-lg leading-none">×</span>
          </button>
        </div>
      </div>

      {/* Grid de Resultados */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPiezas.map(pieza => (
          <div key={pieza.slug} className="h-full bg-white border-2 border-black p-6 transition-transform hover:-translate-y-1 hover:shadow-xl">
            <PieceCard pieza={pieza} />
          </div>
        ))}
      </section>

      {filteredPiezas.length === 0 && (
        <div className="py-48 text-center bg-white border-2 border-black mt-8">
          <span className="font-mono text-sm uppercase tracking-widest text-gray-500">No se encontraron piezas con esta combinación de filtros.</span>
        </div>
      )}
    </div>
  );
}
