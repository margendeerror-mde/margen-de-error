'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isEntryPage = pathname === '/';
  const isRedPage = pathname === '/red';

  if (isEntryPage || isRedPage) return null;

  return (
    <footer className="w-full border-t-2 border-black bg-transparent text-black mt-24">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        <div className="flex flex-col gap-6">
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] opacity-80">
            MARGEN DE ERROR<br />
            PERIODISMO CIENTÍFICO INDEPENDIENTE
          </div>
          <Link href="/atlas" className="font-mono text-[10px] font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white border-2 border-black px-4 py-2 inline-flex self-start transition-colors">
            → EXPLORAR EL ATLAS DEL ERROR
          </Link>
        </div>
        
        <div className="flex flex-wrap gap-x-8 gap-y-4 font-mono text-[10px] uppercase font-bold tracking-[0.15em]">
          <Link href="https://www.instagram.com/margendeerror.mde/" target="_blank" rel="noopener noreferrer" className="hover:bg-black hover:text-white px-2 py-1 -ml-2 transition-colors">
            INSTAGRAM
          </Link>
          <Link href="https://www.linkedin.com/in/margen-de-error-mde/" target="_blank" rel="noopener noreferrer" className="hover:bg-black hover:text-white px-2 py-1 -ml-2 transition-colors">
            LINKEDIN
          </Link>
          <Link href="https://x.com/mde_uy" target="_blank" rel="noopener noreferrer" className="hover:bg-black hover:text-white px-2 py-1 -ml-2 transition-colors">
            X (TWITTER)
          </Link>
          <div className="w-px h-4 bg-black/20 hidden md:block self-center mx-2" />
          <Link href="/carta" className="hover:bg-black hover:text-white px-2 py-1 -ml-2 transition-colors">
            ACERCA DE
          </Link>
          <Link href="/privacidad" className="hover:bg-black hover:text-white px-2 py-1 -ml-2 transition-colors">
            PRIVACIDAD
          </Link>
        </div>
      </div>
    </footer>
  );
}
