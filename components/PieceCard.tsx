import Link from 'next/link';
import { Pieza } from '@/lib/types';

export default function PieceCard({ pieza, featured = false }: { pieza: Pieza, featured?: boolean }) {
  return (
    <Link 
      href={`/${pieza.seccion}/${pieza.slug}`}
      className={`group flex flex-col transition-all ${featured ? 'col-span-full mb-12' : 'col-span-1'}`}
    >
      <div className="flex gap-4">
        {/* Vertical Section Name - Pradasphere Style */}
        <div className="hidden md:flex items-start pt-1">
          <span className="tag-text !text-muted [writing-mode:vertical-lr] rotate-180 h-fit">
            {pieza.seccion}
          </span>
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap gap-3 mb-3">
            <span className="tag-text text-accent">{pieza.tema}</span>
            <span className="tag-text text-muted">{pieza.industria}</span>
          </div>
          
          <h3 className={`title-serif mb-3 group-hover:text-accent transition-colors leading-[1.1] ${featured ? 'text-4xl md:text-6xl max-w-4xl' : 'text-2xl md:text-3xl'}`}>
            {pieza.titulo}
          </h3>
          
          <p className={`text-muted leading-relaxed line-clamp-2 max-w-2xl ${featured ? 'text-lg' : 'text-sm'}`}>
            {pieza.resumen}
          </p>
          
          <div className="mt-4 flex items-center gap-4">
            <span className="tag-text !text-muted/40">{pieza.fecha}</span>
            {pieza.mecanismo.slice(0, 1).map(m => (
              <span key={m} className="tag-text !text-accent/60 opacity-0 group-hover:opacity-100 transition-opacity">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
