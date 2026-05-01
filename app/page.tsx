import { getPiezas, getAvailableTags } from '@/lib/content';
import PieceCard from '@/components/PieceCard';
import Filters from '@/components/Filters';
import { Suspense } from 'react';
import Link from 'next/link';

export default function Home({
  searchParams,
}: {
  searchParams: { industria?: string; mecanismo?: string; tema?: string }
}) {
  const todasLasPiezas = getPiezas();
  const tags = getAvailableTags(todasLasPiezas);
  
  // Filtering logic for multiple selection
  const filterByValue = (piezaValue: string | string[], paramValue?: string) => {
    if (!paramValue) return true;
    const selected = paramValue.split(',');
    const piezaVals = Array.isArray(piezaValue) ? piezaValue : [piezaValue];
    return selected.some(s => piezaVals.includes(s as any));
  };

  let feed = todasLasPiezas.filter(p => 
    filterByValue(p.industria, searchParams.industria) &&
    filterByValue(p.mecanismo, searchParams.mecanismo) &&
    filterByValue(p.tema, searchParams.tema)
  );

  const destacada = feed.length > 0 ? feed[0] : null;
  const resto = feed.length > 1 ? feed.slice(1) : [];

  return (
    <div className="max-w-7xl mx-auto pb-24">
      <Suspense fallback={<div className="h-40 bg-background/50 border-b border-border/30" />}>
        <Filters tags={tags} />
      </Suspense>
      
      <div className="px-4 py-12">
        {destacada && (
          <section className="mb-24">
            <PieceCard pieza={destacada} featured={true} />
          </section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          {resto.map(pieza => (
            <PieceCard key={pieza.slug} pieza={pieza} />
          ))}
        </section>

        {feed.length === 0 && (
          <div className="py-24 text-center">
            <span className="tag-text !text-muted">No se encontraron piezas con esta combinación de filtros.</span>
          </div>
        )}

        <footer className="mt-48 pt-12 border-t border-border/30 flex justify-center">
          <Link href="/red" className="tag-text !text-[12px] hover:text-accent transition-colors">
            — VER RED DE CONEXIONES →
          </Link>
        </footer>
      </div>
    </div>
  );
}
