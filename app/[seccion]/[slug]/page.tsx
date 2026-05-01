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

const TagLink = ({ type, value, color = false }: { type: string, value: string, color?: boolean }) => (
  <Link 
    href={`/?${type}=${value}`}
    className={`tag-text transition-colors ${color ? 'text-accent hover:opacity-70' : 'text-muted hover:text-accent'}`}
  >
    {value}
  </Link>
);

export default function PiezaPage({ params }: { params: { seccion: string, slug: string } }) {
  const seccion = decodeURIComponent(params.seccion);
  const pieza = getPieza(seccion, params.slug);
  
  if (!pieza) {
    notFound();
  }

  const allPiezas = getPiezas();
  const related = allPiezas.filter(p => 
    p.slug !== pieza.slug &&
    (p.tema === pieza.tema || p.industria === pieza.industria || p.mecanismo.some(m => pieza.mecanismo.includes(m)))
  ).slice(0, 3);

  return (
    <article className="max-w-screen-xl mx-auto w-full px-4 pt-24 pb-48">
      <div className="max-w-[680px] mx-auto">
        <header className="mb-16">
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8 items-center">
            <TagLink type="seccion" value={pieza.seccion} color />
            <TagLink type="tema" value={pieza.tema} />
            <TagLink type="industria" value={pieza.industria} />
            {pieza.mecanismo.slice(0, 2).map(m => (
              <TagLink key={m} type="mecanismo" value={m} />
            ))}
          </div>
          
          <h1 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] mb-10 tracking-tight font-bold">
            {pieza.titulo}
          </h1>
          
          <div className="flex items-center gap-4 mb-12">
            <span className="tag-text !text-muted/50">{pieza.fecha}</span>
            <div className="flex-1 h-[1px] bg-[#E0E0E0]" />
          </div>

          <div className="font-serif text-xl md:text-2xl text-muted/80 leading-relaxed mb-16 italic border-l-2 border-accent pl-6">
            {pieza.resumen}
          </div>
        </header>

        <div className="prose prose-lg content-serif prose-p:mb-8 prose-p:text-foreground prose-headings:font-serif prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:border-b-accent prose-a:border-b prose-a:border-transparent prose-a:transition-all max-w-none">
          <MDXRemote source={pieza.content} />
        </div>

        {related.length > 0 && (
          <footer className="mt-48 pt-12 border-t border-border/30">
            <h3 className="tag-text !text-muted/40 mb-12">PIEZAS RELACIONADAS</h3>
            <div className="grid gap-12 md:grid-cols-3">
              {related.map(p => (
                <Link key={p.slug} href={`/${p.seccion}/${p.slug}`} className="group block">
                  <span className="tag-text !text-accent block mb-2">{p.seccion}</span>
                  <h4 className="font-serif text-lg leading-tight group-hover:text-accent transition-colors">
                    {p.titulo}
                  </h4>
                </Link>
              ))}
            </div>
          </footer>
        )}
      </div>
    </article>
  );
}
