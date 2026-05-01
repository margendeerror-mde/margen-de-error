import { getPieza } from '@/lib/content';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import GlobalMenu from '@/components/GlobalMenu';

export default function PiecePage({ 
  params, 
  seccionNormalizada 
}: { 
  params: { slug: string }, 
  seccionNormalizada: string 
}) {
  const pieza = getPieza(seccionNormalizada, params.slug);
  
  if (!pieza) {
    notFound();
  }

  const TagLink = ({ type, value }: { type: string, value: string }) => (
    <Link 
      href={`/archivo?${type}=${value}`}
      className="tag-text !text-[10px] text-muted hover:text-accent transition-colors"
    >
      {value}
    </Link>
  );

  return (
    <article className="max-w-screen-xl mx-auto w-full px-4 pt-24 pb-48">
      <GlobalMenu />
      
      <div className="max-w-[680px] mx-auto">
        <header className="mb-16">
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 items-center">
            <Link href={`/${seccionNormalizada.replace('á', 'a')}`} className="tag-text !text-accent font-bold">
              {pieza.seccion}
            </Link>
            <TagLink type="tema" value={pieza.tema} />
            <TagLink type="industria" value={pieza.industria} />
            {pieza.mecanismo.map(m => (
              <TagLink key={m} type="mecanismo" value={m} />
            ))}
          </div>
          
          <h1 className="font-serif text-[clamp(2.2rem,4vw,3.5rem)] leading-[1.1] mb-10 tracking-tight font-bold">
            {pieza.titulo}
          </h1>
          
          <div className="flex items-center gap-4 mb-12">
            <span className="tag-text !text-muted/50">{pieza.fecha}</span>
            <div className="flex-1 h-[1px] bg-[#E0E0E0]" />
          </div>

          <div className="font-serif text-xl text-muted leading-relaxed mb-16 italic border-l-2 border-accent pl-6">
            {pieza.resumen}
          </div>
        </header>

        <div className="prose prose-lg content-serif prose-p:mb-8 prose-p:text-foreground prose-headings:font-serif prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:border-b-accent prose-a:border-b prose-a:border-transparent prose-a:transition-all max-w-none">
          {pieza.content.trim() === '— Contenido en desarrollo —' ? (
            <div className="py-24 text-center">
              <span className="tag-text !text-[11px] !text-[#999] tracking-[0.2em]">
                — CONTENIDO EN DESARROLLO —
              </span>
            </div>
          ) : (
            <MDXRemote source={pieza.content} />
          )}
        </div>
      </div>
    </article>
  );
}
