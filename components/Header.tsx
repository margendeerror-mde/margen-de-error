import Link from 'next/link';

export default function Header() {
  const menuItems = [
    { name: 'HISTORIAS', href: '/historia' },
    { name: 'CONFLICTOS', href: '/conflicto' },
    { name: 'SERENDIPIA', href: '/serendipia' },
    { name: 'ANÁLISIS', href: '/analisis' },
    { name: 'MARCO', href: '/marco' },
    { name: 'RED', href: '/red' },
  ];

  return (
    <header className="py-8 px-4 flex flex-col items-center gap-6 border-b border-border/30 bg-background">
      <Link href="/" className="tag-text !text-[13px] tracking-[0.5em] font-bold hover:text-accent transition-colors">
        MARGEN DE ERROR
      </Link>
      
      <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className="tag-text !text-[10px] tracking-[0.2em] text-muted hover:text-accent transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
