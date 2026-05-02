import Link from 'next/link';
import { Pieza, SECCION_COLORS } from '@/lib/types';

export default function PieceCard({ pieza, featured = false }: { pieza: Pieza, featured?: boolean }) {
  // Normalize section for URL (historias, conflictos, etc.)
  const seccionUrl = pieza.seccion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const accentColor = SECCION_COLORS[seccionUrl] || '#000000';
  
  return (
    <Link 
      href={`/${seccionUrl}/${pieza.slug}`}
      className={`group flex flex-col transition-all relative ${featured ? 'md:col-span-2' : 'col-span-1'}`}
    >
      <div 
        className="flex gap-6 border-l-2 pl-6 transition-colors duration-500"
        style={{ borderColor: accentColor }}
      >
        {/* Vertical Metadata */}
        <div className="hidden md:flex flex-col gap-8 pt-2 items-center">
          <span className="tag-text !text-[9px] !text-muted/40 [writing-mode:vertical-lr] rotate-180 uppercase tracking-[0.3em]">
            {pieza.seccion}
          </span>
          <div className="w-[1px] h-full bg-border/20" />
        </div>

        <div className="flex-1 pb-8">
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
            <span className="tag-text !text-[9px] font-bold" style={{ color: accentColor }}>{pieza.tema}</span>
            <span className="tag-text !text-muted/60 !text-[9px]">{pieza.industria}</span>
          </div>
          
          <h3 className={`mb-4 group-hover:text-accent transition-colors leading-[1.05] ${
            featured 
              ? 'font-sans font-bold text-[clamp(2.2rem,5vw,4rem)] tracking-[-0.03em]' 
              : 'title-serif text-xl md:text-2xl'
          }`}>
            {pieza.titulo}
          </h3>
          
          <p className="text-muted/80 leading-relaxed line-clamp-2 max-w-xl text-[15px] font-serif">
            {pieza.resumen}
          </p>
          
          <div className="mt-6 flex items-center justify-between">
            <span className="tag-text !text-[8px] !text-muted/30">{pieza.fecha}</span>
            <span className="tag-text !text-[8px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: accentColor }}>
              LEER PIEZA →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
