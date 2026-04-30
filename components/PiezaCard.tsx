import Link from 'next/link';
import { PiezaMeta } from '@/lib/types';
import TagBadge from './TagBadge';

export default function PiezaCard({ pieza }: { pieza: PiezaMeta }) {
  const date = new Date(pieza.fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <article className="group flex flex-col gap-3 py-8 border-b border-border last:border-0 relative h-full">
      <div className="flex gap-2 mb-2 flex-wrap">
        <TagBadge tipo="seccion" valor={pieza.seccion} />
        {pieza.industria && <TagBadge tipo="industria" valor={pieza.industria} />}
      </div>
      
      <Link href={`/${pieza.seccion}/${pieza.slug}`} className="block flex-1">
        <h3 className="font-serif text-2xl md:text-3xl text-foreground group-hover:text-accent transition-colors leading-tight mb-3">
          {pieza.titulo}
        </h3>
        <p className="text-muted leading-relaxed line-clamp-3 text-sm md:text-base">
          {pieza.resumen}
        </p>
      </Link>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
        <div className="flex gap-1.5 flex-wrap">
          {pieza.mecanismo.map(m => (
            <TagBadge key={m} tipo="mecanismo" valor={m} />
          ))}
        </div>
        <time className="text-xs text-muted font-mono uppercase tracking-wider ml-4 shrink-0">
          {date}
        </time>
      </div>
    </article>
  );
}
