'use client';

import { useState } from 'react';
import AtlasView from './AtlasView';
import RedView from '../red/RedView';
import type { Pieza } from '@/lib/types';
import GlobalMenu from '@/components/GlobalMenu';

export default function AtlasRedController({ piezas, tags, initialFilter }: { piezas: Pieza[], tags: any, initialFilter?: { tipo: 'distorsión' | 'límite' | 'industria' | 'tema' | null, valor: string | null } }) {
  const [view, setView] = useState<'atlas' | 'red'>('atlas');

  const ToggleButton = ({ dark }: { dark?: boolean }) => (
    <div className="flex flex-col items-end">
      <span className={`font-mono text-[10px] uppercase tracking-widest font-bold mb-2 ${dark ? 'text-white/60' : 'text-gray-500'}`}>
        Modo de Vista
      </span>
      <div className={`flex rounded-full p-1 border-2 ${dark ? 'border-white/20 bg-black' : 'border-black bg-white'}`}>
        <button
          onClick={() => setView('atlas')}
          className={`px-4 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest font-bold transition-colors ${
            view === 'atlas' 
              ? (dark ? 'bg-white text-black' : 'bg-[#CC0000] text-white') 
              : (dark ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-black')
          }`}
        >
          ENCICLOPEDIA
        </button>
        <button
          onClick={() => setView('red')}
          className={`px-4 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest font-bold transition-colors ${
            view === 'red' 
              ? (dark ? 'bg-white text-black' : 'bg-black text-white') 
              : (dark ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-black')
          }`}
        >
          RED DE CONEXIONES
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 selection:bg-black selection:text-white ${view === 'red' ? 'bg-[#0A0A0A] text-white overflow-hidden h-screen' : 'bg-[#F0EDE8] text-black'}`}>
      
      <GlobalMenu dark={view === 'red'} />
      
      {view === 'atlas' ? (
        <main className="max-w-screen-2xl mx-auto px-4 md:px-8 pt-32 pb-32">
          {/* Editorial Header */}
          <header className="mb-12 border-b-2 border-black pb-8">
            <h1 className="text-[clamp(3rem,8vw,6rem)] font-extrabold tracking-tighter uppercase leading-[0.85] mb-6">
              ATLAS DEL ERROR
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <p className="font-serif text-xl md:text-2xl leading-snug max-w-4xl opacity-80">
                  Las formas en que una inferencia científica puede deformarse o encontrar sus límites. Cada mecanismo está ilustrado por casos reales de nuestra investigación.
                </p>
              </div>
              <div className="flex flex-col justify-start md:items-end md:pl-8 pt-4 md:pt-0">
                <ToggleButton />
              </div>
            </div>
          </header>
          
          <AtlasView piezas={piezas} tags={tags} initialFilter={initialFilter} />
        </main>
      ) : (
        <div className="w-full h-full relative pt-20">
          <div className="absolute top-24 right-6 md:top-24 md:right-8 z-[210]">
            <ToggleButton dark />
          </div>
          <RedView piezas={piezas} />
        </div>
      )}
    </div>
  );
}
