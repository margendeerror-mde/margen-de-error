import { getPieza } from '@/lib/content';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import GlobalMenu from '@/components/GlobalMenu';
import { VOLUMEN_COLORS, ATLAS_COLORS, ATLAS_DEFINICIONES, getAtlasTipo } from '@/lib/types';
import type { AtlasMecanismo } from '@/lib/types';
import Newsletter from '@/components/Newsletter';
import SevenCountriesChart from '@/components/SevenCountriesChart';

export default function PiecePage({ 
  params,
  temporadaId
}: { 
  params: { slug: string },
  temporadaId?: string | number
}) {
  const pieza = getPieza(temporadaId || 'archivo', params.slug);
  
  if (!pieza) {
    notFound();
  }

  const accentColor = pieza.temporada ? VOLUMEN_COLORS[pieza.temporada] : '#666666';

  const TagLink = ({ type, value }: { type: string, value: string }) => (
    <Link 
      href={`/atlas?${type}=${value}`}
      className="font-mono text-[10px] font-bold uppercase tracking-widest border-2 border-black/20 px-2 py-1 text-black/60 hover:text-black hover:border-black transition-colors"
    >
      {value.replace(/-/g, ' ')}
    </Link>
  );

  return (
    <article className="max-w-screen-xl mx-auto w-full px-4 pt-32 pb-48 bg-[#F0EDE8] text-black min-h-screen">
      <GlobalMenu />
      
      <div className="max-w-[800px] mx-auto">
        <header className="mb-16 border-b-2 border-black pb-12">
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8 items-center">
            <Link 
              href={pieza.temporada ? `/temporadas/${pieza.temporada}` : '/atlas'} 
              className="font-mono text-[10px] font-bold uppercase tracking-widest border-2 border-black px-2 py-1 transition-colors hover:bg-black hover:text-white"
              style={{ backgroundColor: accentColor, color: '#fff', borderColor: 'black' }}
            >
              {pieza.temporada ? `VOLUMEN ${pieza.temporada}` : 'ARCHIVO'}
            </Link>
            <TagLink type="tema" value={pieza.tema} />
            <TagLink type="industria" value={pieza.industria} />
          </div>
          
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold tracking-tighter uppercase leading-[0.9] mb-8">
            {pieza.titulo}
          </h1>
          
          <div className="flex items-center gap-4 mb-12">
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-black/50">{pieza.fecha}</span>
            <div className="flex-1 h-[2px] bg-black/10" />
          </div>

          <div className="font-serif text-xl md:text-2xl leading-snug opacity-80 mb-12">
            {pieza.resumen}
          </div>

          {/* Atlas badges */}
          {pieza.atlas?.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-16">
              {pieza.atlas.map((a: string) => {
                const tipo = getAtlasTipo(a as AtlasMecanismo);
                const definicion = ATLAS_DEFINICIONES[a as AtlasMecanismo];
                return (
                  <Link
                    key={a}
                    href={`/atlas?atlas=${a}`}
                    className="group/atlas flex flex-col gap-1 px-4 py-3 border-2 transition-colors duration-300 hover:bg-black hover:text-white max-w-xs"
                    style={{ 
                      borderColor: ATLAS_COLORS[tipo],
                      backgroundColor: 'transparent',
                    }}
                  >
                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: ATLAS_COLORS[tipo] }}>
                      {tipo === 'distorsión' ? '⊘ DISTORSIÓN' : '◎ LÍMITE'}
                    </span>
                    <span className="font-serif text-sm font-bold text-[#0A0A0A]">
                      {a.replace(/-/g, ' ')}
                    </span>
                    {definicion && (
                      <span className="text-[11px] text-muted/60 leading-snug font-serif hidden group-hover/atlas:block">
                        {definicion}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </header>

        {pieza.spotifyUrl && (
          <div className="mb-12 pb-12 border-b" style={{ borderColor: `${accentColor}33` }}>
            <iframe 
              style={{ borderRadius: '12px' }} 
              src={pieza.spotifyUrl.replace('open.spotify.com/episode/', 'open.spotify.com/embed/episode/').replace('open.spotify.com/show/', 'open.spotify.com/embed/show/').split('?')[0] + '?utm_source=generator&theme=0'} 
              width="100%" 
              height="152" 
              frameBorder="0" 
              allowFullScreen 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            ></iframe>
          </div>
        )}

        <div className="prose prose-lg content-serif prose-p:text-foreground prose-headings:font-serif prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:border-b-accent prose-a:border-b prose-a:border-transparent prose-a:transition-all max-w-none">
          <MDXRemote 
            source={pieza.content} 
            components={{
              SevenCountriesChart,
              a: ({ href, children, ...props }: any) => {
                const isExternal = href?.startsWith('http');
                if (isExternal) {
                  return (
                    <a 
                      href={href}
                      target="_blank" 
                      rel="noopener noreferrer"
                      {...props}
                    >
                      {children}
                    </a>
                  );
                }
                return (
                  <Link href={href} {...props}>
                    {children}
                  </Link>
                );
              }
            }}
          />
        </div>

      </div>
      
      <div className="mt-48">
        <Newsletter />
      </div>
    </article>
  );
}
