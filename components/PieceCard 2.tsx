import Link from 'next/link';
import { Pieza, VOLUMEN_COLORS, ATLAS_COLORS, getAtlasTipo } from '@/lib/types';
import type { AtlasMecanismo } from '@/lib/types';

export default function PieceCard({ pieza, featured = false }: { pieza: Pieza, featured?: boolean }) {
  const accentColor = pieza.temporada ? VOLUMEN_COLORS[pieza.temporada] : '#666666';
  
  // Use the first atlas mechanism for the primary color accent
  const primaryAtlas = pieza.atlas?.[0] as AtlasMecanismo | undefined;
  const atlasTipo = primaryAtlas ? getAtlasTipo(primaryAtlas) : null;

  const isPublished = pieza.publicado !== false;

  const cardContent = (
    <div 
      className={`flex gap-6 border-l-2 pl-6 transition-colors duration-500 ${!isPublished ? 'opacity-40 grayscale' : ''}`}
      style={{ borderColor: isPublished ? accentColor : '#999' }}
    >
      {/* Vertical Metadata */}
      <div className="hidden md:flex flex-col gap-8 pt-2 items-center">
        <span className="tag-text !text-[9px] !text-muted/40 [writing-mode:vertical-lr] rotate-180 uppercase tracking-[0.3em]">
          {pieza.temporada ? `VOL ${pieza.temporada}` : 'ARCHIVO'}
        </span>
        <div className="w-[1px] h-full bg-border/20" />
      </div>

      <div className="flex-1 pb-8">
        {/* Atlas mechanism badges */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
          {pieza.atlas?.length > 0 ? (
            pieza.atlas.map((a: string) => {
              const tipo = getAtlasTipo(a as AtlasMecanismo);
              return (
                <span 
                  key={a} 
                  className="tag-text !text-[9px] font-bold"
                  style={{ color: ATLAS_COLORS[tipo] }}
                >
                  {a.replace(/-/g, ' ')}
                </span>
              );
            })
          ) : (
            <span className="tag-text !text-[9px] font-bold" style={{ color: accentColor }}>{pieza.tema}</span>
          )}
          <span className="tag-text !text-muted/60 !text-[9px]">{pieza.industria}</span>
        </div>
        
        <h3 className={`mb-4 transition-colors leading-[1.05] ${
          featured 
            ? 'font-sans font-bold text-[clamp(2.2rem,5vw,4rem)] tracking-[-0.03em]' 
            : 'title-serif text-xl md:text-2xl'
        } ${isPublished ? 'group-hover:text-[color:var(--hover-color)]' : ''}`}>
          {pieza.titulo}
        </h3>

        {/* Pregunta */}
        {pieza.pregunta && (
          <p className="text-muted/60 leading-relaxed text-[13px] font-serif italic mb-3 max-w-xl">
            {pieza.pregunta}
          </p>
        )}
        
        <p className="text-muted/80 leading-relaxed line-clamp-2 max-w-xl text-[15px] font-serif">
          {pieza.resumen}
        </p>
        
        <div className="mt-6 flex items-center justify-between">
          <span className="tag-text !text-[8px] !text-muted/30">{pieza.fecha}</span>
          {isPublished ? (
            <span className="tag-text !text-[8px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: accentColor }}>
              LEER EPISODIO →
            </span>
          ) : (
            <span className="tag-text !text-[8px] tracking-widest font-bold" style={{ color: '#999' }}>
              PRÓXIMAMENTE
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (!isPublished) {
    return (
      <div 
        className={`group flex flex-col transition-all relative ${featured ? 'md:col-span-2' : 'col-span-1'} cursor-not-allowed`}
        style={{ '--hover-color': '#999' } as React.CSSProperties}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link 
      href={pieza.href}
      className={`group flex flex-col transition-all relative ${featured ? 'md:col-span-2' : 'col-span-1'}`}
      style={{ '--hover-color': accentColor } as React.CSSProperties}
    >
      {cardContent}
    </Link>
  );
}
