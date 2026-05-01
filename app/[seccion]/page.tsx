import { getPiezasBySeccion, getAvailableTags } from '@/lib/content';
import { SECCIONES, Seccion } from '@/lib/types';
import PieceCard from '@/components/PieceCard';
import Filters from '@/components/Filters';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export function generateStaticParams() {
  return SECCIONES.map(s => ({ seccion: s }));
}

export default function SeccionPage({
  params,
  searchParams,
}: {
  params: { seccion: string };
  searchParams: { industria?: string; mecanismo?: string; tema?: string }
}) {
  if (!SECCIONES.includes(params.seccion as Seccion)) {
    notFound();
  }

  let piezas = getPiezasBySeccion(params.seccion);
  const tags = getAvailableTags(piezas);

  if (searchParams.industria) piezas = piezas.filter(p => p.industria === searchParams.industria);
  if (searchParams.mecanismo) piezas = piezas.filter(p => p.mecanismo.includes(searchParams.mecanismo as any));
  if (searchParams.tema) piezas = piezas.filter(p => p.tema === searchParams.tema);

  return (
    <>
      <header className="border-b border-editorial py-8 px-4">
        <h1 className="font-serif text-6xl capitalize">{params.seccion}</h1>
      </header>
      <Suspense fallback={<div className="h-16 border-b border-editorial bg-background" />}>
        <Filters tags={tags} />
      </Suspense>
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {piezas.map(pieza => (
          <PieceCard key={pieza.slug} pieza={pieza} showSeccion={false} />
        ))}
        {piezas.length === 0 && (
          <div className="p-8 tag-text text-muted">No hay piezas que coincidan con estos filtros.</div>
        )}
      </section>
    </>
  );
}
