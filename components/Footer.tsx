'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isEntryPage = pathname === '/';
  const isRedPage = pathname === '/red';

  if (isEntryPage || isRedPage) return null;

  return (
    <footer className="max-w-7xl mx-auto px-4 py-24 mt-24">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[#999]">
        <div className="tag-text !text-[10px] tracking-[0.2em] font-bold">
          MARGEN DE ERROR — PERIODISMO CIENTÍFICO INDEPENDIENTE
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
