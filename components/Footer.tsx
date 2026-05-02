'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isEntryPage = pathname === '/';
  const isRedPage = pathname === '/red';

  if (isEntryPage || isRedPage) return null;

  return (
    <footer className="max-w-7xl mx-auto px-4 py-24 mt-24 border-t border-border/10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-12 text-[#999]">
        <div className="flex flex-col gap-4 items-center md:items-start">
          <div className="tag-text !text-[10px] tracking-[0.2em] font-bold">
            MARGEN DE ERROR — PERIODISMO CIENTÍFICO INDEPENDIENTE
          </div>
          <Link href="/red" className="tag-text !text-[11px] text-accent hover:opacity-70 transition-opacity font-bold tracking-[0.1em]">
            → VER RED DE CONEXIONES
          </Link>
        </div>
        
        <div className="flex gap-8">
          <Link href="#" className="tag-text !text-[10px] tracking-[0.1em] hover:text-accent transition-colors">
            [INSTAGRAM]
          </Link>
          <Link href="#" className="tag-text !text-[10px] tracking-[0.1em] hover:text-accent transition-colors">
            [X / TWITTER]
          </Link>
          <Link href="/privacidad" className="tag-text !text-[10px] tracking-[0.1em] hover:text-accent transition-colors">
            [POLÍTICA DE PRIVACIDAD]
          </Link>
        </div>
      </div>
    </footer>
  );
}
