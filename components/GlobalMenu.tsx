'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GlobalMenu({ dark = false }: { dark?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  const sections = [
    { name: 'HISTORIAS', href: '/historias' },
    { name: 'CONFLICTOS', href: '/conflictos' },
    { name: 'SERENDIPIA', href: '/serendipia' },
    { name: 'ANÁLISIS', href: '/analisis' },
    { name: 'MARCO', href: '/marco' },
  ];

  return (
    <>
      {/* Top Left Home Link (Internal Pages Only) */}
      {!isHome && (
        <div className="fixed top-8 left-8 z-[200]">
          <Link href="/" className="tag-text !text-[11px] tracking-[0.15em] font-bold text-black hover:text-accent transition-colors">
            MARGEN DE ERROR
          </Link>
        </div>
      )}

      {/* Top Right Global Menu */}
      <div className={`fixed top-6 right-6 md:top-8 md:right-8 z-[200] flex gap-4 md:gap-8 items-start ${dark ? 'text-white' : 'text-black'}`}>
        <div 
          className="relative"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <button className={`tag-text !text-[10px] tracking-[0.15em] font-bold hover:text-accent transition-colors px-2 py-1 rounded ${dark ? 'bg-black/40 md:bg-transparent' : 'bg-white/40 md:bg-transparent'} backdrop-blur-sm md:backdrop-blur-none`}>
            SECCIONES
          </button>
          
          {isOpen && (
            <div className="absolute top-full right-0 pt-4 animate-in fade-in duration-150">
              <div className={`flex flex-col gap-3 p-6 min-w-[160px] text-right ${dark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-md shadow-xl`}>
                {sections.map(s => (
                  <Link 
                    key={s.href} 
                    href={s.href}
                    className={`tag-text !text-[9px] hover:text-accent transition-colors ${pathname === s.href ? 'text-accent' : ''}`}
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <Link 
          href="/red" 
          className={`tag-text !text-[10px] tracking-[0.15em] font-bold hover:text-accent transition-colors px-2 py-1 rounded ${dark ? 'bg-black/40 md:bg-transparent' : 'bg-white/40 md:bg-transparent'} backdrop-blur-sm md:backdrop-blur-none ${pathname === '/red' ? 'text-accent' : ''}`}
        >
          RED
        </Link>
      </div>
    </>
  );
}
