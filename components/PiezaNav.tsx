import Link from 'next/link';
import { PiezaMeta } from '@/lib/types';

interface PiezaNavProps {
  prev: PiezaMeta | null; // Más antigua
  next: PiezaMeta | null; // Más reciente
}

export default function PiezaNav({ prev, next }: PiezaNavProps) {
  if (!prev && !next) return null;

  return (
    <nav className="border-t border-border pt-12 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {prev ? (
        <Link 
          href={`/${prev.seccion}/${prev.slug}`}
          className="group flex flex-col gap-2 p-6 border border-border hover:border-foreground transition-colors rounded-sm"
        >
          <span className="text-xs uppercase tracking-wider text-muted group-hover:text-foreground transition-colors font-mono">
            ← Más antiguo
          </span>
          <span className="font-serif text-xl md:text-2xl text-foreground group-hover:text-accent transition-colors leading-tight">
            {prev.titulo}
          </span>
        </Link>
      ) : (
        <div />
      )}
      
      {next ? (
        <Link 
          href={`/${next.seccion}/${next.slug}`}
          className="group flex flex-col gap-2 p-6 border border-border hover:border-foreground transition-colors rounded-sm md:text-right"
        >
          <span className="text-xs uppercase tracking-wider text-muted group-hover:text-foreground transition-colors font-mono">
            Más reciente →
          </span>
          <span className="font-serif text-xl md:text-2xl text-foreground group-hover:text-accent transition-colors leading-tight">
            {next.titulo}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
