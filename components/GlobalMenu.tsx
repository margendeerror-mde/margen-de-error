'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GlobalMenu({ dark = false, activeIdx, forceHide }: { dark?: boolean, activeIdx?: number, forceHide?: boolean }) {
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

  // Hide the top-left logo on Home (index 0) because it's redundant with the main title
  const hideHomeLogo = activeIdx === 0;
  
  // Hide the entire menu on Newsletter when the parent tells us to
  const hideAllMenu = forceHide || activeIdx === 6;

  return (
    <>
      {/* Top Left Logo/Home Link */}
      <div className={`fixed top-8 left-8 z-[200] transition-all duration-700 ${hideAllMenu || hideHomeLogo ? 'opacity-0 pointer-events-none translate-x-[-20px]' : 'opacity-100 translate-x-0'}`}>
        <Link href="/">
          {isHome ? (
            <img 
              src="/assets/logo.svg" 
              alt="Margen de Error" 
              className={`h-8 md:h-10 w-auto ${dark ? 'invert' : ''}`}
            />
          ) : (
            <span className={`tag-text !text-[11px] tracking-[0.15em] font-bold hover:text-accent transition-colors ${dark ? 'text-white' : 'text-black'}`}>
              MARGEN DE ERROR
            </span>
          )}
        </Link>
      </div>

      {/* Top Right Global Menu */}
      <div className={`fixed top-6 right-6 md:top-8 md:right-8 z-[200] flex gap-4 md:gap-8 items-start transition-all duration-700 ${dark ? 'text-white' : 'text-black'} ${hideAllMenu ? 'opacity-0 pointer-events-none translate-y-[-20px]' : 'opacity-100 translate-y-0'}`}>
        <div 
          className="relative"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <button className={`tag-text !text-[10px] tracking-[0.15em] font-bold hover:text-accent transition-colors px-2 py-1`}>
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
          className={`tag-text !text-[10px] tracking-[0.15em] font-bold hover:text-accent transition-colors px-2 py-1 ${pathname === '/red' ? 'text-accent' : ''}`}
        >
          RED
        </Link>
      </div>
    </>
  );
}
