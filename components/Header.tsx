import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-sm border-b border-editorial px-4 py-3 flex justify-between items-center">
      <Link href="/" className="font-serif text-2xl hover:text-accent transition-colors">
        Margen de Error
      </Link>
      <nav className="flex gap-6 items-center">
        <Link href="/red" className="tag-text hover:text-accent transition-colors">
          Red Interactiva
        </Link>
        <div className="flex gap-4">
          <Link href="/historias" className="tag-text hover:text-accent transition-colors">Historias</Link>
          <Link href="/conflictos" className="tag-text hover:text-accent transition-colors">Conflictos</Link>
          <Link href="/serendipia" className="tag-text hover:text-accent transition-colors">Serendipia</Link>
          <Link href="/analisis" className="tag-text hover:text-accent transition-colors">Análisis</Link>
          <Link href="/marco" className="tag-text hover:text-accent transition-colors">Marco</Link>
        </div>
      </nav>
    </header>
  );
}
