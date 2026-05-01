import { getPieza, getPiezas } from '@/lib/content';
import { SECCIONES } from '@/lib/types';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export function generateStaticParams() {
  const params: { seccion: string, slug: string }[] = [];
  const piezas = getPiezas();
  piezas.forEach(p => {
    params.push({ seccion: p.seccion, slug: p.slug });
  });
  return params;
}

export default function PiezaPage({ params }: { params: { seccion: string, slug: string } }) {
  const pieza = getPieza(params.seccion, params.slug);
  
  if (!pieza) {
    notFound();
  }

  // Related pieces sharing at least one tag
  const allPiezas = getPiezas();
  const related = allPiezas.filter(p => 
    p.slug !== pieza.slug &&
    (p.tema === pieza.tema || p.industria === pieza.industria || p.mecanismo.some(m => pieza.mecanismo.includes(m)))
  ).slice(0, 3);

  return (
    <article className="max-w-[680px] mx-auto w-full px-4 py-16">
      <header className="mb-12">
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-6 border-b border-editorial pb-4">
          <span className="tag-text text-accent">{pieza.seccion}</span>
          <span className="tag-text">{pieza.tema}</span>
          <span className="tag-text">{pieza.industria}</span>
          {pieza.mecanismo.map(m => (
            <span key={m} className="tag-text border border-editorial px-1">{m}</span>
          ))}
        </div>
        <h1 className="font-serif text-5xl md:text-6xl leading-[0.95] mb-6">
          {pieza.titulo}
        </h1>
        <p className="text-xl text-muted leading-relaxed">
          {pieza.resumen}
        </p>
      </header>

      <div className="prose prose-lg prose-p:text-foreground prose-p:leading-relaxed prose-a:text-accent prose-a:no-underline hover:prose-a:border-b-accent prose-a:border-b prose-a:border-transparent prose-a:transition-all max-w-none">
        <MDXRemote source={pieza.content} />
      </div>

      {related.length > 0 && (
        <footer className="mt-24 pt-8 border-t border-editorial">
          <h3 className="tag-text text-muted mb-6">Sigue el hilo:</h3>
          <div className="grid gap-6">
            {related.map(p => (
              <Link key={p.slug} href={`/${p.seccion}/${p.slug}`} className="group block">
                <span className="tag-text text-muted block mb-1">
                  Coincide en: {p.tema === pieza.tema ? p.tema : p.industria === pieza.industria ? p.industria : 'Mecanismo'}
                </span>
                <h4 className="font-serif text-2xl group-hover:text-accent transition-colors">
                  {p.titulo}
                </h4>
              </Link>
            ))}
          </div>
        </footer>
      )}
    </article>
  );
}
