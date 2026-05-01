'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const sections = [
  {
    id: 'historia',
    title: 'HISTORIAS',
    subtitle: 'Relatos sobre cómo la ciencia se equivoca.',
    number: '01',
    bgColor: '#0A0A0A',
    textColor: '#FFFFFF',
    accentColor: '#CC0000',
    detail: 'line',
  },
  {
    id: 'conflicto',
    title: 'CONFLICTOS',
    subtitle: 'Conclusiones demasiado convenientes.',
    number: '02',
    bgColor: '#FAFAF8',
    textColor: '#0A0A0A',
    accentColor: '#CC0000',
    detail: 'glitch',
  },
  {
    id: 'serendipia',
    title: 'SERENDIPIA',
    subtitle: 'Lo que la ciencia encontró sin buscar.',
    number: '03',
    bgColor: '#1A1A2E',
    textColor: '#FFFFFF',
    accentColor: '#D4C5F9',
    detail: 'dots',
  },
  {
    id: 'análisis',
    title: 'ANÁLISIS',
    subtitle: 'Papers leídos en voz alta.',
    number: '04',
    bgColor: '#FAFAF8',
    textColor: '#0A0A0A',
    accentColor: '#0A0A0A',
    detail: 'quote',
  },
  {
    id: 'marco',
    title: 'MARCO',
    subtitle: 'Cómo funciona la máquina que produce conocimiento.',
    number: '05',
    bgColor: '#0A0A0A',
    textColor: '#FFFFFF',
    accentColor: '#FFFFFF',
    detail: 'grid',
  },
  {
    id: 'cierre',
    title: 'MARGEN DE ERROR',
    subtitle: 'Un proyecto sobre cómo llegamos a creer lo que la ciencia dice.',
    number: 'END',
    bgColor: '#CC0000',
    textColor: '#FFFFFF',
    accentColor: '#FFFFFF',
    detail: 'none',
  }
];

export default function EntryPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollTop, clientWidth, clientHeight } = e.currentTarget;
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

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans">
      {/* Scroll Container */}
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
            {/* Visual Details */}
            <VisualDetail type={section.detail} active={activeIdx === idx} />

            {/* Number */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-50">
              <span className="tag-text !text-[11px] tracking-[0.4em]">
                FORMATO / {section.number}
              </span>
            </div>

            {/* Content */}
            <div className={`text-center px-6 z-10 transition-all duration-1000 ${activeIdx === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="font-extrabold text-[clamp(3.5rem,12vw,9rem)] leading-[0.9] tracking-[-0.04em] uppercase mb-8">
                {section.title}
              </h2>
              <div className="relative inline-block">
                <p className="font-serif text-lg md:text-2xl opacity-80 max-w-xl">
                  {section.subtitle}
                </p>
                {section.detail === 'glitch' && (
                  <p className="font-serif text-lg md:text-2xl absolute inset-0 text-accent opacity-15 translate-x-[3px] translate-y-[3px] pointer-events-none">
                    {section.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Call to Action */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-8 z-20">
              {section.id === 'cierre' ? (
                <>
                  <Link href="/archivo" className="tag-text !text-[12px] tracking-[0.2em] border border-white/20 px-8 py-4 hover:bg-white hover:text-[#CC0000] transition-all">
                    → VER ARCHIVO
                  </Link>
                  <Link href="/red" className="tag-text !text-[12px] tracking-[0.2em] border border-white/20 px-8 py-4 hover:bg-white hover:text-[#CC0000] transition-all">
                    → VER RED
                  </Link>
                </>
              ) : (
                <Link 
                  href={`/${section.id}`} 
                  className="tag-text !text-[14px] tracking-[0.3em] font-bold hover:opacity-70 transition-opacity"
                  style={{ color: section.accentColor }}
                >
                  → LEER
                </Link>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* Navigation Indicators */}
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
            style={{ backgroundColor: activeIdx === idx ? sections[activeIdx].textColor : 'transparent', borderColor: sections[activeIdx].textColor }}
          />
        ))}
      </div>

      {/* Arrows (Desktop only) */}
      {!isMobile && (
        <div className="pointer-events-none absolute inset-0 z-[110] flex items-center justify-between px-8">
          <button 
            onClick={() => scrollTo(Math.max(0, activeIdx - 1))}
            className={`pointer-events-auto tag-text !text-[10px] opacity-0 hover:opacity-100 transition-opacity ${activeIdx === 0 ? 'invisible' : ''}`}
            style={{ color: sections[activeIdx].textColor }}
          >
            ← PREV
          </button>
          <button 
            onClick={() => scrollTo(Math.min(sections.length - 1, activeIdx + 1))}
            className={`pointer-events-auto tag-text !text-[10px] opacity-0 hover:opacity-100 transition-opacity ${activeIdx === sections.length - 1 ? 'invisible' : ''}`}
            style={{ color: sections[activeIdx].textColor }}
          >
            NEXT →
          </button>
        </div>
      )}
    </div>
  );
}

function VisualDetail({ type, active }: { type: string, active: boolean }) {
  switch (type) {
    case 'line':
      return <div className={`absolute top-1/2 left-0 w-full h-[1px] bg-[#CC0000] transition-opacity duration-1000 ${active ? 'opacity-30' : 'opacity-0'}`} />;
    case 'dots':
      return (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-0'}`}>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[#D4C5F9] opacity-40 transition-transform duration-1000"
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
