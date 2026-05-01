import { getPiezas, getAvailableTags } from '@/lib/content';
import PieceCard from '@/components/PieceCard';
import Filters from '@/components/Filters';
import { Suspense } from 'react';

export default function Home({
  searchParams,
}: {
  searchParams: { industria?: string; mecanismo?: string; tema?: string }
}) {
  const todasLasPiezas = getPiezas();
  const tags = getAvailableTags(todasLasPiezas);
  
  // Destacada is the latest piece
  const destacada = todasLasPiezas[0];
  
  // Rest of the pieces
  let feed = todasLasPiezas.slice(1);

  // Apply filters to feed
  if (searchParams.industria) feed = feed.filter(p => p.industria === searchParams.industria);
  if (searchParams.mecanismo) feed = feed.filter(p => p.mecanismo.includes(searchParams.mecanismo as any));
  if (searchParams.tema) feed = feed.filter(p => p.tema === searchParams.tema);

  return (
    <>
      <Suspense fallback={<div className="h-16 border-b border-editorial bg-background" />}>
        <Filters tags={tags} />
      </Suspense>
      
      {/* Destacada */}
      {destacada && !searchParams.industria && !searchParams.mecanismo && !searchParams.tema && (
        <section className="border-b border-editorial py-16 px-4">
          <div className="max-w-4xl">
            <div className="flex gap-2 mb-4">
              <span className="tag-text text-accent">{destacada.seccion}</span>
              <span className="tag-text">{destacada.tema}</span>
              <span className="tag-text">{destacada.industria}</span>
            </div>
            <a href={`/${destacada.seccion}/${destacada.slug}`} className="group block">
              <h2 className="font-serif text-5xl md:text-7xl mb-6 group-hover:text-accent transition-colors leading-[0.9]">
                {destacada.titulo}
              </h2>
              <p className="text-xl text-muted max-w-2xl leading-relaxed">
                {destacada.resumen}
              </p>
            </a>
          </div>
        </section>
      )}

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {feed.map(pieza => (
          <PieceCard key={pieza.slug} pieza={pieza} />
        ))}
      </section>
    </>
  );
}
