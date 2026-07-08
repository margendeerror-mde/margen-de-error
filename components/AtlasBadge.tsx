'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AtlasBadge({ 
  a, 
  tipo, 
  definicion, 
  color 
}: { 
  a: string; 
  tipo: string; 
  definicion?: string; 
  color: string; 
}) {
  const [tapped, setTapped] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // Si estamos en un dispositivo touch y no hemos tapeado aún,
    // prevenimos la navegación y mostramos el tooltip.
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      if (!tapped) {
        e.preventDefault();
        setTapped(true);
      }
    }
  };

  const tipoLabel = tipo === 'distorsión' ? '⊘ DISTORSIÓN' : tipo === 'límite' ? '◎ LÍMITE' : '⊞ CONTEXTO';

  return (
    <Link
      href={`/atlas?atlas=${a}`}
      onClick={handleClick}
      className={`group/atlas flex flex-col gap-1 px-4 py-3 border-2 transition-colors duration-300 hover:bg-black hover:text-white max-w-xs ${tapped ? 'bg-black text-white' : ''}`}
      style={!tapped ? { 
        borderColor: color,
        backgroundColor: 'transparent',
      } : {
        borderColor: color,
        backgroundColor: 'black',
        color: 'white'
      }}
    >
      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: tapped ? 'white' : color }}>
        {tipoLabel}
      </span>
      <span className={`font-serif text-sm font-bold ${tapped ? 'text-white' : 'text-[#0A0A0A]'} group-hover/atlas:text-white`}>
        {a.replace(/-/g, ' ')}
      </span>
      {definicion && (
        <span className={`text-[11px] leading-snug font-serif ${tapped ? 'block text-white/80' : 'hidden group-hover/atlas:block text-muted/60'}`}>
          {definicion}
        </span>
      )}
    </Link>
  );
}
