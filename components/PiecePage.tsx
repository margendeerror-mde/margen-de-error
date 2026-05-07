import { getPieza } from '@/lib/content';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import GlobalMenu from '@/components/GlobalMenu';
import { SECCION_COLORS } from '@/lib/types';
import Newsletter from '@/components/Newsletter';

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

  const accentColor = SECCION_COLORS[seccionNormalizada] || '#CC0000';

  const TagLink = ({ type, value }: { type: string, value: string }) => (
    <Link 
      href={`/archivo?${type}=${value}`}
      className="tag-text !text-[10px] text-muted hover:text-accent transition-colors"
    >
      {value}
    </Link>
  );

  return (
    <article className="max-w-screen-xl mx-auto w-full px-4 pt-24 pb-48 bg-[#FAFAF8] text-[#0A0A0A]">
      <GlobalMenu />
      
      <div className="max-w-[680px] mx-auto">
        <header className="mb-16">
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 items-center">
            <Link 
              href={`/${seccionNormalizada.replace('á', 'a')}`} 
              className="tag-text font-bold"
              style={{ color: accentColor }}
            >
              {pieza.seccion.toUpperCase()}
            </Link>
            <TagLink type="tema" value={pieza.tema} />
            <TagLink type="industria" value={pieza.industria} />
            {pieza.mecanismo.map((m: string) => (
              <TagLink key={m} type="mecanismo" value={m} />
            ))}
          </div>
          
          <h1 className="font-serif text-[clamp(2.2rem,4vw,3.5rem)] leading-[1.1] mb-10 tracking-tight font-bold">
            {pieza.titulo}
          </h1>
          
          <div className="flex items-center gap-4 mb-12">
            <span className="tag-text !text-muted/50">{pieza.fecha}</span>
            <div className="flex-1 h-[1px]" style={{ backgroundColor: `${accentColor}33` }} />
            <div className="w-8 h-1" style={{ backgroundColor: accentColor }} />
          </div>

          <div 
            className="font-serif text-xl text-muted leading-relaxed mb-16 italic pl-6 border-l-2"
            style={{ borderLeftColor: accentColor }}
          >
            {pieza.resumen}
          </div>
        </header>

        <div className="prose prose-lg content-serif prose-p:text-foreground prose-headings:font-serif prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:border-b-accent prose-a:border-b prose-a:border-transparent prose-a:transition-all max-w-none">
          <MDXRemote source={pieza.content} />
        </div>
      </div>
      
      <div className="mt-48">
        <Newsletter />
      </div>
    </article>
  );
}
