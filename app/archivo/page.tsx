import { getPiezas, getAvailableTags } from '@/lib/content';
import PieceCard from '@/components/PieceCard';
import Filters from '@/components/Filters';
import GlobalMenu from '@/components/GlobalMenu';
import { Suspense } from 'react';

export default function ArchivoPage({
  searchParams,
}: {
  searchParams: { industria?: string; mecanismo?: string; tema?: string }
}) {
  const todasLasPiezas = getPiezas();
  const tags = getAvailableTags(todasLasPiezas);
  
  const filterByValue = (piezaValue: string | string[], paramValue?: string) => {
    if (!paramValue) return true;
    const selected = paramValue.split(',');
    const piezaVals = Array.isArray(piezaValue) ? piezaValue : [piezaValue];
    return selected.some(s => piezaVals.includes(s as any));
  };

  const feed = todasLasPiezas.filter(p => 
    filterByValue(p.industria, searchParams.industria) &&
    filterByValue(p.mecanismo, searchParams.mecanismo) &&
    filterByValue(p.tema, searchParams.tema)
  );

  return (
    <div className="max-w-7xl mx-auto pb-24 px-4 min-h-screen">
      <GlobalMenu />
      
      <header className="py-24 border-b border-border/30">
        <h1 className="tag-text !text-[13px] tracking-[0.4em] font-bold mb-4">ARCHIVO GENERAL</h1>
        <p className="font-serif text-lg text-muted max-w-2xl">
          Explora la totalidad de las piezas conectadas por industria, mecanismo de distorsión y tema.
        </p>
      </header>

      <Suspense fallback={<div className="h-40 bg-background/50 border-b border-border/30" />}>
        <Filters tags={tags} />
      </Suspense>
      
      <div className="py-12">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          {feed.map(pieza => (
            <PieceCard key={pieza.slug} pieza={pieza} />
          ))}
        </section>

        {feed.length === 0 && (
          <div className="py-48 text-center">
            <span className="tag-text !text-muted">No se encontraron piezas con esta combinación de filtros en el archivo.</span>
          </div>
        )}
      </div>
    </div>
  );
}
