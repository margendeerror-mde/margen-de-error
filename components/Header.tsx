'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  // Hide header on immersive entry page
  if (pathname === '/') return null;

  const menuItems = [
    { name: 'INICIO', href: '/' },
    { name: 'ARCHIVO', href: '/archivo' },
    { name: 'RED', href: '/red' },
  ];

  return (
    <header className="py-8 px-4 flex flex-col items-center gap-6 border-b border-border/30 bg-background sticky top-0 z-[80]">
      <Link href="/" className="tag-text !text-[13px] tracking-[0.5em] font-bold hover:text-accent transition-colors">
        MARGEN DE ERROR
      </Link>
      
      <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`tag-text !text-[10px] tracking-[0.2em] transition-colors ${
              pathname === item.href ? 'text-accent' : 'text-muted hover:text-accent'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
