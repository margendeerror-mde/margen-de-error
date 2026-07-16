'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VOLUMENES, VOLUMEN_COLORS, ATLAS_COLORS } from '@/lib/types';

export default function GlobalMenu({ dark = false, activeIdx, forceHide }: { dark?: boolean, activeIdx?: number, forceHide?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const pathname = usePathname();
  const isHome = pathname === '/';

  const hideHomeLogo = activeIdx === 0;
  const hideAllMenu = forceHide || activeIdx === 7;

  return (
    <>
      {/* Top Left Logo/Home Link */}
      <div className={`fixed top-6 left-6 md:top-8 md:left-8 z-[200] transition-all duration-700 ${hideAllMenu || hideHomeLogo ? 'opacity-0 pointer-events-none translate-x-[-20px]' : 'opacity-100 translate-x-0'} ${dark ? 'text-white' : 'text-black'}`}>
        <Link href="/" className="tag-text !text-[10px] tracking-[0.15em] font-bold hover:text-accent transition-colors px-2 py-1">
          MARGEN DE ERROR
        </Link>
      </div>

      {/* Top Right Global Menu */}
      <div className={`fixed top-6 right-6 md:top-8 md:right-8 z-[200] flex gap-4 md:gap-8 items-start transition-all duration-700 ${dark ? 'text-white' : 'text-black'} ${hideAllMenu ? 'opacity-0 pointer-events-none translate-y-[-20px]' : 'opacity-100 translate-y-0'}`}>
        <div
          className="relative"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => { setIsOpen(false); setHoveredKey(null); }}
        >
          <button 
            className="tag-text !text-[10px] tracking-[0.15em] font-bold hover:text-accent transition-colors px-2 py-1 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            MENÚ
          </button>

          {isOpen && (
            <div className="absolute top-full right-0 pt-4 animate-in fade-in duration-150">
              <div className={`flex flex-col gap-2 p-6 min-w-[200px] text-right ${dark ? 'bg-black/90' : 'bg-[#F0EDE8] border-2 border-black'} backdrop-blur-md shadow-xl`}>
                
                <Link
                  href="/volumenes"
                  className="font-mono text-xs font-bold uppercase tracking-widest transition-colors duration-150 mb-1"
                  style={{ color: hoveredKey === 'volumenes' ? VOLUMEN_COLORS[2] : (dark ? '#ffffff' : '#000000') }}
                  onMouseEnter={() => setHoveredKey('volumenes')}
                  onMouseLeave={() => setHoveredKey(null)}
                >
                  VOLÚMENES
                </Link>
                
                <Link
                  href="/volumenes/1"
                  className="font-mono text-[9px] uppercase tracking-widest transition-colors duration-150 pr-2 opacity-70"
                  style={{ color: hoveredKey === 'v1' ? VOLUMEN_COLORS[1] : (dark ? '#ffffff' : '#000000') }}
                  onMouseEnter={() => setHoveredKey('v1')}
                  onMouseLeave={() => setHoveredKey(null)}
                >
                  VOLUMEN 01
                </Link>
                <Link
                  href="/volumenes/2"
                  className="font-mono text-[9px] uppercase tracking-widest transition-colors duration-150 pr-2 opacity-70"
                  style={{ color: hoveredKey === 'v2' ? '#999' : (dark ? '#ffffff' : '#000000') }}
                  onMouseEnter={() => setHoveredKey('v2')}
                  onMouseLeave={() => setHoveredKey(null)}
                >
                  VOLUMEN 02
                </Link>
                <Link
                  href="/volumenes/3"
                  className="font-mono text-[9px] uppercase tracking-widest transition-colors duration-150 pr-2 opacity-70"
                  style={{ color: hoveredKey === 'v3' ? VOLUMEN_COLORS[3] : (dark ? '#ffffff' : '#000000') }}
                  onMouseEnter={() => setHoveredKey('v3')}
                  onMouseLeave={() => setHoveredKey(null)}
                >
                  VOLUMEN 03
                </Link>

                <div className={`h-[1px] my-3 ${dark ? 'bg-white/10' : 'bg-black/20'}`} />

                <Link
                  href="/atlas"
                  className="font-mono text-xs font-bold uppercase tracking-widest transition-colors duration-150 mb-2"
                  style={{ color: hoveredKey === 'atlas' ? ATLAS_COLORS.distorsión : (dark ? '#ffffff' : '#000000') }}
                  onMouseEnter={() => setHoveredKey('atlas')}
                  onMouseLeave={() => setHoveredKey(null)}
                >
                  ATLAS DEL ERROR
                </Link>
                
                <Link
                  href="/carta"
                  className="font-mono text-xs font-bold uppercase tracking-widest transition-colors duration-150 mb-2"
                  style={{ color: hoveredKey === 'acerca' ? '#999999' : (dark ? '#ffffff' : '#000000') }}
                  onMouseEnter={() => setHoveredKey('acerca')}
                  onMouseLeave={() => setHoveredKey(null)}
                >
                  ACERCA DE
                </Link>
                
                <Link
                  href="/privacidad"
                  className="font-mono text-xs font-bold uppercase tracking-widest transition-colors duration-150"
                  style={{ color: hoveredKey === 'privacidad' ? '#999999' : (dark ? '#ffffff' : '#000000') }}
                  onMouseEnter={() => setHoveredKey('privacidad')}
                  onMouseLeave={() => setHoveredKey(null)}
                >
                  PRIVACIDAD
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
