import { getPiezasBySeccion, getAvailableTags } from '@/lib/content';
import { SECCIONES, Seccion } from '@/lib/types';
import PieceCard from '@/components/PieceCard';
import Filters from '@/components/Filters';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

const SECCION_DESCRIPTIONS: Record<string, string> = {
  historia: "Genealogía de las narrativas que moldean nuestra percepción científica.",
  conflicto: "Donde el interés privado choca con la integridad del dato público.",
  serendipia: "Hallazgos inesperados y conexiones laterales en el ruido informativo.",
  análisis: "Desglose técnico de la metodología y la retórica de la distorsión.",
  marco: "Estructuras conceptuales para entender cómo se construye la verdad."
};

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
  const seccionNormalizada = decodeURIComponent(params.seccion) as Seccion;
  if (!SECCIONES.includes(seccionNormalizada)) {
    notFound();
  }

  const todasLasPiezas = getPiezasBySeccion(seccionNormalizada);
  const tags = getAvailableTags(todasLasPiezas);

  const filterByValue = (piezaValue: string | string[], paramValue?: string) => {
    if (!paramValue) return true;
    const selected = paramValue.split(',');
    const piezaVals = Array.isArray(piezaValue) ? piezaValue : [piezaValue];
    return selected.some(s => piezaVals.includes(s as any));
  };

  let piezas = todasLasPiezas.filter(p => 
    filterByValue(p.industria, searchParams.industria) &&
    filterByValue(p.mecanismo, searchParams.mecanismo) &&
    filterByValue(p.tema, searchParams.tema)
  );

  return (
    <div className="max-w-7xl mx-auto pb-24">
      <header className="px-4 py-12 border-b border-border/30">
        <span className="tag-text !text-accent block mb-2">{seccionNormalizada}</span>
        <h1 className="font-serif text-2xl md:text-3xl text-muted leading-tight max-w-2xl">
          {SECCION_DESCRIPTIONS[seccionNormalizada] || "Explorando Margen de Error."}
        </h1>
      </header>

      <Suspense fallback={<div className="h-40 bg-background/50 border-b border-border/30" />}>
        <Filters tags={tags} />
      </Suspense>

      <div className="px-4 py-12">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          {piezas.map(pieza => (
            <PieceCard key={pieza.slug} pieza={pieza} />
          ))}
          {piezas.length === 0 && (
            <div className="col-span-full py-24 text-center">
              <span className="tag-text !text-muted">No hay piezas que coincidan con estos filtros en esta sección.</span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
