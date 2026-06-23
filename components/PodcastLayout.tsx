"use client";

import { useState } from 'react';
import { Pieza, SECCION_COLORS } from '@/lib/types';
import PieceCard from '@/components/PieceCard';
import GlobalMenu from '@/components/GlobalMenu';

interface SectionLayoutProps {
  title: string;
  description: string;
  seccion: string;
  piezas: Pieza[];
}

const SEASON_TITLES: Record<number, string> = {
  1: "Cómo se deforma la evidencia",
  2: "Las personas detrás de las ideas",
  3: "Los límites de la evidencia"
};

export default function PodcastLayout({ title, description, seccion, piezas }: SectionLayoutProps) {
  const accentColor = SECCION_COLORS[seccion] || '#1DB954';

  // Group pieces by season
  const groupedPiezas = piezas.reduce((acc, pieza) => {
    const season = pieza.temporada || 1;
    if (!acc[season]) acc[season] = [];
    acc[season].push(pieza);
    return acc;
  }, {} as Record<number, Pieza[]>);

  // Sort episodes inside seasons
  Object.keys(groupedPiezas).forEach((season) => {
    groupedPiezas[Number(season)].sort((a, b) => {
      const epA = a.capitulo || 0;
      const epB = b.capitulo || 0;
      // Ascending order: Episode 1, 2, 3...
      return epA - epB; 
    });
  });

  // Sort seasons descending so the newest season is at the top
  const sortedSeasons = Object.keys(groupedPiezas)
    .map(Number)
    .sort((a, b) => b - a);

  // By default, expand the newest season
  const [expandedSeasons, setExpandedSeasons] = useState<Record<number, boolean>>({
    [sortedSeasons[0]]: true
  });

  const toggleSeason = (season: number) => {
    setExpandedSeasons(prev => ({
      ...prev,
      [season]: !prev[season]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen bg-[#FAFAF8] text-[#0A0A0A] font-sans">
      <GlobalMenu />
      
      <header className="mb-24 mt-12">
        <span 
          className="tag-text !text-[11px] block mb-4 tracking-[0.2em] font-bold"
          style={{ color: accentColor }}
        >
          {title.toUpperCase()}
        </span>
        <p className="font-serif text-xl md:text-2xl text-[#666] leading-tight max-w-2xl">
          {description}
        </p>
      </header>

      <div className="flex flex-col gap-y-32">
        {sortedSeasons.map((season) => {
          const isExpanded = expandedSeasons[season];
          return (
            <section key={season} className="border-b border-gray-200 pb-8">
              <button 
                onClick={() => toggleSeason(season)}
                className="w-full text-left flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-[#0A0A0A] group-hover:text-black transition-colors">
                    Temporada {season}
                  </h2>
                  {SEASON_TITLES[season] && (
                    <p className="text-xl font-serif text-[#666] mt-2 group-hover:text-[#444] transition-colors">
                      {SEASON_TITLES[season]}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 group-hover:border-gray-400 transition-colors">
                  <span className={`transform transition-transform duration-300 text-2xl ${isExpanded ? 'rotate-180' : ''}`}>
                    ↓
                  </span>
                </div>
              </button>
              
              <div 
                className={`grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 transition-all duration-500 overflow-hidden ${
                  isExpanded ? 'mt-16 max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                {groupedPiezas[season].map(pieza => (
                  <PieceCard key={pieza.slug} pieza={pieza} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
