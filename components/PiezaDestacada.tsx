import Link from 'next/link';
import { PiezaMeta } from '@/lib/types';
import TagBadge from './TagBadge';

export default function PiezaDestacada({ pieza }: { pieza: PiezaMeta }) {
  const date = new Date(pieza.fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article className="group relative border-b-2 border-foreground pb-12 mb-12">
      <div className="flex gap-2 mb-6 flex-wrap">
        <TagBadge tipo="seccion" valor={pieza.seccion} />
        {pieza.industria && <TagBadge tipo="industria" valor={pieza.industria} />}
        {pieza.mecanismo.map(m => (
          <TagBadge key={m} tipo="mecanismo" valor={m} />
        ))}
      </div>
      
      <Link href={`/${pieza.seccion}/${pieza.slug}`} className="block">
        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground group-hover:text-accent transition-colors leading-[1.1] mb-6">
          {pieza.titulo}
        </h2>
      </Link>
      
      <p className="text-xl md:text-2xl text-muted leading-relaxed max-w-3xl mb-10">
        {pieza.resumen}
      </p>
      
      <div className="flex items-center text-sm border-t border-border pt-4">
        <time className="font-mono uppercase tracking-wider text-muted">
          {date}
        </time>
        <Link 
          href={`/${pieza.seccion}/${pieza.slug}`}
          className="ml-auto inline-flex items-center text-accent uppercase tracking-wider font-medium hover:underline underline-offset-4"
        >
          Leer artículo
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
