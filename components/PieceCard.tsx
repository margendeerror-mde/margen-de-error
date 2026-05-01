import Link from 'next/link';
import { Pieza } from '@/lib/types';

export default function PieceCard({ pieza, showSeccion = true }: { pieza: Pieza, showSeccion?: boolean }) {
  return (
    <Link 
      href={`/${pieza.seccion}/${pieza.slug}`}
      className="group flex flex-col border-b border-editorial last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 p-4 hover:bg-muted/5 transition-colors"
    >
      <div className="flex flex-wrap gap-2 mb-3">
        {showSeccion && (
          <span className="tag-text text-accent">{pieza.seccion}</span>
        )}
        <span className="tag-text">{pieza.tema}</span>
        <span className="tag-text">{pieza.industria}</span>
        {pieza.mecanismo.map(m => (
          <span key={m} className="tag-text border border-editorial px-1">{m}</span>
        ))}
      </div>
      <h3 className="font-serif text-2xl md:text-3xl mb-2 group-hover:text-accent transition-colors leading-tight">
        {pieza.titulo}
      </h3>
      <p className="text-sm text-muted line-clamp-3">
        {pieza.resumen}
      </p>
      <span className="mt-auto pt-4 text-[10px] font-mono text-muted/50">{pieza.fecha}</span>
    </Link>
  );
}
