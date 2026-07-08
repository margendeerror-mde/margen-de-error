import { VOLUMENES, VOLUMEN_COLORS } from '@/lib/types';
import Link from 'next/link';
import GlobalMenu from '@/components/GlobalMenu';

export default function VolumenesPage() {
  const volumenes = Object.entries(VOLUMENES).map(([id, info]) => ({
    id: Number(id),
    ...info
  }));

  return (
    <div className="min-h-screen bg-[#F0EDE8] text-black font-sans selection:bg-black selection:text-white">
      <GlobalMenu dark={false} />
      
      <main className="max-w-screen-2xl mx-auto px-4 md:px-8 pt-32 pb-24">
        
        {/* Editorial Header */}
        <header className="mb-12 border-b-2 border-black pb-8">
          <h1 className="text-[clamp(4rem,10vw,8rem)] font-extrabold tracking-tighter uppercase leading-[0.85] mb-6">
            VOLÚMENES
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="font-serif text-2xl md:text-3xl leading-snug max-w-4xl">
                Margen de Error es una serie documental. Cada volumen explora una tesis central sobre cómo producimos, analizamos y comunicamos el conocimiento.
              </p>
            </div>
            <div className="flex flex-col justify-end text-sm font-mono uppercase tracking-widest border-t md:border-t-0 md:border-l border-black md:pl-8 pt-4 md:pt-0">
              <div className="mb-2">
                <span className="font-bold">Estado de Publicación</span>
              </div>
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-black rounded-full" />
                    <div className="w-2 h-2 bg-black rounded-full" />
                    <div className="w-2 h-2 bg-black rounded-full" />
                  </div>
                  <span className="text-xs">Vol 01: Completo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#CC0000] rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-[#CC0000] rounded-full animate-pulse" />
                    <div className="w-2 h-2 border border-black rounded-full" />
                  </div>
                  <span className="text-xs">Vol 02: En emisión (2 cap.)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 border border-black rounded-full opacity-50" />
                    <div className="w-2 h-2 border border-black rounded-full opacity-50" />
                    <div className="w-2 h-2 border border-black rounded-full opacity-50" />
                  </div>
                  <span className="text-xs text-gray-500">Vol 03: Próximamente</span>
                </div>
              </div>
              <span className="text-gray-500 text-xs mt-auto">Actualizado 2026</span>
            </div>
          </div>
        </header>

        {/* Brutalist Grid */}
        <div className="grid grid-cols-1 gap-y-12">
          {volumenes.map((v) => {
            const accentColor = VOLUMEN_COLORS[v.id] || '#CC0000';
            
            return (
              <Link 
                key={v.id} 
                href={`/volumenes/${v.id}`}
                className="group block border-2 border-black bg-white hover:bg-black hover:text-white transition-colors duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[400px]">
                  
                  {/* Typographic "Cover" block */}
                  <div className="lg:col-span-4 border-b-2 lg:border-b-0 lg:border-r-2 border-black flex items-center justify-center p-8 bg-[#F0EDE8] group-hover:bg-black transition-colors duration-300 relative overflow-hidden">
                    {/* Background Accent Grid / Graphic */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    
                    <span 
                      className="font-serif text-[15rem] leading-none tracking-tighter select-none z-10 mix-blend-difference text-white transition-transform duration-700 group-hover:scale-110"
                    >
                      {v.id.toString().padStart(2, '0')}
                    </span>
                  </div>
                  
                  {/* Content block */}
                  <div className="lg:col-span-8 flex flex-col">
                    
                    {/* Top Meta Bar */}
                    <div className="flex border-b-2 border-black">
                      <div className="px-6 py-3 font-mono text-xs uppercase tracking-widest border-r-2 border-black flex-1 md:flex-none">
                        VOLUMEN {v.id}
                      </div>
                      <div className="px-6 py-3 font-mono text-xs uppercase tracking-widest hidden md:block flex-1">
                        Ensayo Escrito & Sonoro
                      </div>
                      <div 
                        className="w-12 shrink-0 transition-colors duration-300" 
                        style={{ backgroundColor: accentColor }}
                      />
                    </div>
                    
                    {/* Main Text */}
                    <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
                      <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter uppercase leading-[0.9] mb-6">
                        {v.titulo}
                      </h2>
                      
                      <p className="font-serif text-xl md:text-2xl leading-relaxed max-w-3xl opacity-80 mb-8">
                        {v.descripcion}
                      </p>
                    </div>

                    {/* Bottom CTA Bar */}
                    <div className="border-t-2 border-black px-6 py-4 flex justify-between items-center bg-[#F0EDE8] group-hover:bg-black transition-colors duration-300">
                      <span className="font-mono text-sm uppercase tracking-widest font-bold">
                        Explorar Capítulos
                      </span>
                      <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>

                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
