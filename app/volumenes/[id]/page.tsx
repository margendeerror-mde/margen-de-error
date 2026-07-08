import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import GlobalMenu from '@/components/GlobalMenu';
import { getPiezasByTemporada } from '@/lib/content';
import { VOLUMENES, VOLUMEN_COLORS } from '@/lib/types';

export async function generateStaticParams() {
  return Object.keys(VOLUMENES).map(id => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = Number(id);
  const info = VOLUMENES[numId];
  if (!info) return {};

  return {
    title: `Volumen ${numId}: ${info.titulo} | Margen de Error`,
    description: info.descripcion,
    openGraph: {
      title: `Volumen ${numId}: ${info.titulo}`,
      description: info.descripcion,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Volumen ${numId}: ${info.titulo}`,
      description: info.descripcion,
    }
  };
}

export default async function VolumenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = Number(id);
  const info = VOLUMENES[numId];
  
  if (!info) {
    notFound();
  }

  const allTemporadas = getPiezasByTemporada();
  const episodios = allTemporadas[numId] || [];
  const accentColor = VOLUMEN_COLORS[numId] || '#CC0000';

  return (
    <div className="min-h-screen bg-[#F0EDE8] text-black font-sans selection:bg-black selection:text-white">
      <GlobalMenu dark={false} />
      
      <main className="max-w-screen-2xl mx-auto px-4 md:px-8 pt-32 pb-24">
        
        {/* Editorial Header */}
        <header className="mb-12 border-b-2 border-black pb-8">
          <div className="flex items-center gap-4 mb-6">
            <span 
              className="font-mono text-sm uppercase tracking-widest font-bold bg-black text-white px-3 py-1"
            >
              VOLUMEN {numId}
            </span>
          </div>
          <h1 className="text-[clamp(3rem,8vw,6rem)] font-extrabold tracking-tighter uppercase leading-[0.85] mb-6">
            {info.titulo}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="font-serif text-xl md:text-2xl leading-snug max-w-4xl opacity-80">
                {info.descripcion}
              </p>
            </div>
            <div className="flex flex-col justify-end text-sm font-mono uppercase tracking-widest border-t md:border-t-0 md:border-l border-black md:pl-8 pt-4 md:pt-0">
              <span>{episodios.length} Capítulos</span>
              <div 
                className="w-12 h-2 mt-4" 
                style={{ backgroundColor: accentColor }}
              />
            </div>
          </div>
        </header>

        {/* Brutalist List */}
        <div className="flex flex-col border-t-2 border-l-2 border-r-2 border-black">
          {episodios.map((ep, index) => {
            const numCap = ep.capitulo || (index + 1);
            
            // Si no está publicado, renderizamos un div deshabilitado en lugar de un Link
            const isUnpublished = ep.publicado === false;
            
            const content = (
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[250px]">
                {/* Number block */}
                <div className="md:col-span-3 lg:col-span-2 border-b-2 md:border-b-0 md:border-r-2 border-black flex flex-col items-center justify-center p-8 bg-[#F0EDE8] group-hover:bg-black transition-colors duration-300">
                  <span className="font-mono text-xs uppercase tracking-widest font-bold mb-2 group-hover:text-white">CAPÍTULO</span>
                  <span className="font-serif text-7xl font-bold tracking-tighter group-hover:text-white">
                    {numCap < 10 ? `0${numCap}` : numCap}
                  </span>
                </div>
                
                {/* Content block */}
                <div className="md:col-span-9 lg:col-span-10 flex flex-col group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  
                  {/* Meta Bar */}
                  <div className="flex border-b-2 border-black">
                    <div className="px-6 py-2 font-mono text-[10px] uppercase tracking-widest border-r-2 border-black flex-1 md:flex-none">
                      {ep.tema}
                    </div>
                    <div className="px-6 py-2 font-mono text-[10px] uppercase tracking-widest border-r-2 border-black flex-1 md:flex-none">
                      {ep.industria}
                    </div>
                    <div className="px-6 py-2 font-mono text-[10px] uppercase tracking-widest hidden md:block flex-1 text-right text-gray-500">
                      {isUnpublished ? 'PRÓXIMAMENTE' : 'DISPONIBLE'}
                    </div>
                  </div>
                  
                  <div className="p-8 md:p-10 flex-1 flex flex-col justify-center">
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase leading-[0.9] mb-4">
                      {ep.titulo}
                    </h2>
                    
                    <p className="font-serif text-lg md:text-xl opacity-80 leading-relaxed max-w-3xl mb-6">
                      {ep.resumen}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {ep.atlas.map(a => (
                        <span 
                          key={a} 
                          className="font-mono text-[10px] uppercase tracking-widest border border-current px-2 py-1"
                        >
                          {a.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );

            if (isUnpublished) {
              return (
                <div key={ep.slug} className="group border-b-2 border-black opacity-50 grayscale select-none">
                  {content}
                </div>
              );
            }

            return (
              <Link 
                key={ep.slug}
                href={`/volumenes/${numId}/${ep.slug}`}
                className="group border-b-2 border-black hover:shadow-2xl transition-shadow"
              >
                {content}
              </Link>
            );
          })}
          
          {episodios.length === 0 && (
            <div className="text-center py-32 border-b-2 border-black font-mono text-sm uppercase tracking-widest text-gray-500">
              <p>Los capítulos de este volumen aún no están disponibles.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
