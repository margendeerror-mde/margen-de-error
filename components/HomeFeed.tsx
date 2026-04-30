'use client';

import { useState, useMemo } from 'react';
import { PiezaMeta, SECCIONES, INDUSTRIAS, MECANISMOS, Seccion, Industria, Mecanismo } from '@/lib/types';
import PiezaCard from './PiezaCard';
import TagBadge from './TagBadge';

interface HomeFeedProps {
  initialPiezas: PiezaMeta[];
}

export default function HomeFeed({ initialPiezas }: HomeFeedProps) {
  const [selectedSeccion, setSelectedSeccion] = useState<Seccion[]>([]);
  const [selectedIndustria, setSelectedIndustria] = useState<Industria[]>([]);
  const [selectedMecanismo, setSelectedMecanismo] = useState<Mecanismo[]>([]);

  const filteredPiezas = useMemo(() => {
    return initialPiezas.filter((pieza) => {
      const matchSeccion = selectedSeccion.length === 0 || selectedSeccion.includes(pieza.seccion);
      const matchIndustria = selectedIndustria.length === 0 || (pieza.industria && selectedIndustria.includes(pieza.industria));
      const matchMecanismo = selectedMecanismo.length === 0 || pieza.mecanismo.some(m => selectedMecanismo.includes(m));
      
      return matchSeccion && matchIndustria && matchMecanismo;
    });
  }, [initialPiezas, selectedSeccion, selectedIndustria, selectedMecanismo]);

  const toggleTag = (tipo: string, valor: any) => {
    if (tipo === 'seccion') {
      setSelectedSeccion(prev => prev.includes(valor) ? prev.filter(v => v !== valor) : [...prev, valor]);
    } else if (tipo === 'industria') {
      setSelectedIndustria(prev => prev.includes(valor) ? prev.filter(v => v !== valor) : [...prev, valor]);
    } else if (tipo === 'mecanismo') {
      setSelectedMecanismo(prev => prev.includes(valor) ? prev.filter(v => v !== valor) : [...prev, valor]);
    }
  };

  return (
    <div className="mt-16">
      <div className="mb-16 pb-8 border-b border-border">
        <h3 className="text-sm uppercase tracking-wider font-medium text-foreground mb-6">Filtrar Archivo</h3>
        
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-start">
            <span className="text-xs text-muted w-24 uppercase mt-1 mb-2 sm:mb-0 shrink-0">Formato</span>
            <div className="flex flex-wrap gap-2 flex-1">
              {SECCIONES.map(s => (
                <TagBadge 
                  key={s} tipo="seccion" valor={s} 
                  selected={selectedSeccion.includes(s)}
                  onClick={() => toggleTag('seccion', s)}
                />
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-start">
            <span className="text-xs text-muted w-24 uppercase mt-1 mb-2 sm:mb-0 shrink-0">Industria</span>
            <div className="flex flex-wrap gap-2 flex-1">
              {INDUSTRIAS.map(i => (
                <TagBadge 
                  key={i} tipo="industria" valor={i} 
                  selected={selectedIndustria.includes(i)}
                  onClick={() => toggleTag('industria', i)}
                />
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-start">
            <span className="text-xs text-muted w-24 uppercase mt-1 mb-2 sm:mb-0 shrink-0">Mecanismo</span>
            <div className="flex flex-wrap gap-2 flex-1">
              {MECANISMOS.map(m => (
                <TagBadge 
                  key={m} tipo="mecanismo" valor={m} 
                  selected={selectedMecanismo.includes(m)}
                  onClick={() => toggleTag('mecanismo', m)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
        {filteredPiezas.length > 0 ? (
          filteredPiezas.map(pieza => (
            <PiezaCard key={`${pieza.seccion}-${pieza.slug}`} pieza={pieza} />
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-muted border border-dashed border-border rounded-sm">
            <p className="font-serif text-2xl mb-2 text-foreground">Ningún resultado</p>
            <p>No se encontraron piezas que coincidan con todos los filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
