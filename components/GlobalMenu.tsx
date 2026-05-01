'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GlobalMenu({ dark = false }: { dark?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const sections = [
    { name: 'HISTORIAS', href: '/historias' },
    { name: 'CONFLICTOS', href: '/conflictos' },
    { name: 'SERENDIPIA', href: '/serendipia' },
    { name: 'ANÁLISIS', href: '/analisis' },
    { name: 'MARCO', href: '/marco' },
  ];

  return (
    <div className={`fixed top-8 right-8 z-[200] flex gap-8 items-start ${dark ? 'text-white' : 'text-black'}`}>
      <div 
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button className="tag-text !text-[10px] tracking-[0.15em] font-bold hover:text-accent transition-colors">
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
        className={`tag-text !text-[10px] tracking-[0.15em] font-bold hover:text-accent transition-colors ${pathname === '/red' ? 'text-accent' : ''}`}
      >
        RED
      </Link>
    </div>
  );
}
