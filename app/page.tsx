'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import GlobalMenu from '@/components/GlobalMenu';

const sections = [
  {
    id: 'home',
    title: 'MARGEN DE ERROR',
    subtitle: 'Un proyecto sobre cómo se construye, se distorsiona y se comunica el conocimiento científico.',
    bgColor: '#CC0000',
    textColor: '#FFFFFF',
    accentColor: '#FFFFFF',
    detail: 'none',
    isHome: true
  },
  {
    id: 'historias',
    title: 'HISTORIAS',
    subtitle: 'Casos que explican cómo llegamos a saber lo que sabemos.',
    bgColor: '#C4763A',
    textColor: '#FFFFFF',
    accentColor: '#FFFFFF',
    detail: 'line',
  },
  {
    id: 'conflictos',
    title: 'CONFLICTOS',
    subtitle: 'Cuando el resultado de un estudio le queda demasiado bien a alguien.',
    bgColor: '#B5431A',
    textColor: '#FFFFFF',
    accentColor: '#FFFFFF',
    detail: 'glitch',
  },
  {
    id: 'serendipia',
    title: 'SERENDIPIA',
    subtitle: 'Lo que la ciencia encontró sin buscar.',
    bgColor: '#2E5F7A',
    textColor: '#FFFFFF',
    accentColor: '#FFFFFF',
    detail: 'dots',
  },
  {
    id: 'analisis',
    title: 'ANÁLISIS',
    subtitle: 'Papers que merecen más atención de la que reciben.',
    bgColor: '#4A6741',
    textColor: '#FFFFFF',
    accentColor: '#FFFFFF',
    detail: 'quote',
  },
  {
    id: 'marco',
    title: 'MARCO',
    subtitle: 'Las categorías de error que se repiten.',
    bgColor: '#5C4A7A',
    textColor: '#FFFFFF',
    accentColor: '#FFFFFF',
    detail: 'grid',
  }
];

export default function EntryPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollTop, clientWidth, clientHeight } = e.currentTarget;
    if (clientWidth === 0 || clientHeight === 0) return;
    
    const idx = isMobile 
      ? Math.round(scrollTop / clientHeight)
      : Math.round(scrollLeft / clientWidth);
    if (idx !== activeIdx) setActiveIdx(idx);
  };

  const scrollTo = (idx: number) => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    containerRef.current.scrollTo({
      left: isMobile ? 0 : idx * clientWidth,
      top: isMobile ? idx * clientHeight : 0,
      behavior: 'smooth'
    });
  };

  if (!mounted) return <div className="fixed inset-0 bg-black" />;

  // Animation helper
  const getAnimClass = (idx: number, delayClass: string = '') => {
    if (isMobile) return 'opacity-100 translate-y-0';
    return activeIdx === idx 
      ? `opacity-100 translate-y-0 ${delayClass}` 
      : 'opacity-0 translate-y-8';
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans">
      <GlobalMenu dark={true} />

      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className={`w-full h-full flex ${isMobile ? 'flex-col overflow-y-auto' : 'flex-row overflow-x-auto'} scrollbar-hide snap-both snap-mandatory`}
      >
        {sections.map((section, idx) => (
          <section 
            key={section.id}
            className="w-screen h-screen shrink-0 snap-start relative flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000"
            style={{ backgroundColor: section.bgColor, color: section.textColor }}
          >
            <VisualDetail type={section.detail || 'none'} active={activeIdx === idx} />

            <div className={`text-center px-6 z-10 transition-all duration-700 ease-out ${getAnimClass(idx)}`}>
              <h2 className="font-extrabold text-[clamp(3.5rem,12vw,9rem)] leading-[0.9] tracking-[-0.04em] uppercase mb-8">
                {section.title}
              </h2>

              <div className={`relative inline-block mb-12 transition-all duration-700 ${getAnimClass(idx, 'delay-500')}`}>
                <p className="font-serif text-[1.1rem] leading-[1.6] max-w-[520px] mx-auto opacity-80">
                  {section.subtitle}
                </p>
              </div>
            </div>

            {!section.isHome && (
              <div className={`absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-8 z-20 transition-all duration-700 ${getAnimClass(idx, 'delay-700')}`}>
                <Link 
                  href={`/${section.id}`} 
                  className="tag-text !text-[14px] tracking-[0.3em] font-bold hover:opacity-70 transition-opacity"
                  style={{ color: section.accentColor }}
                >
                  → LEER
                </Link>
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-[110]">
        {sections.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              activeIdx === idx 
                ? 'scale-125' 
                : 'opacity-30 border border-current bg-transparent'
            }`}
            style={{ backgroundColor: activeIdx === idx ? '#FFFFFF' : 'transparent', borderColor: '#FFFFFF' }}
          />
        ))}
      </div>
    </div>
  );
}

function VisualDetail({ type, active }: { type: string, active: boolean }) {
  switch (type) {
    case 'line':
      return <div className={`absolute top-1/2 left-0 w-full h-[1px] bg-white transition-opacity duration-1000 ${active ? 'opacity-10' : 'opacity-0'}`} />;
    case 'dots':
      return (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-0'}`}>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white opacity-20 transition-transform duration-1000"
              style={{
                top: `${20 + i * 25}%`,
                left: `${30 + (i % 2) * 40}%`,
                transform: active ? 'scale(1)' : 'scale(0)'
              }}
            />
          ))}
        </div>
      );
    case 'grid':
      return <div className={`absolute inset-0 transition-opacity duration-1000 ${active ? 'opacity-[0.04]' : 'opacity-0'}`} style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />;
    case 'quote':
      return (
        <div className={`absolute top-1/3 right-1/4 max-w-[150px] pointer-events-none italic font-serif text-[10px] leading-relaxed transition-opacity duration-1000 ${active ? 'opacity-20' : 'opacity-0'}`}>
          "The findings suggested that the margin of error was not an accident, but a structural property of the observation itself..."
        </div>
      );
    default:
      return null;
  }
}
