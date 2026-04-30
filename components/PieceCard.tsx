import Link from 'next/link';
import { Piece } from '@/lib/types';

export default function PieceCard({ piece }: { piece: Piece }) {
  return (
    <Link 
      href={`/pieza/${piece.id}`}
      className="group block p-6 border-b border-border last:border-0 hover:bg-muted/10 transition-colors"
    >
      <h4 className="font-serif text-2xl text-foreground group-hover:text-accent transition-colors mb-2 leading-tight">
        {piece.title}
      </h4>
      <p className="text-muted text-sm line-clamp-2 leading-relaxed mb-4">
        {piece.summary}
      </p>
      <div className="flex flex-wrap gap-2">
        {piece.tags.map(tag => (
          <span key={tag} className="text-[10px] uppercase tracking-wider font-mono text-muted group-hover:text-accent/80 transition-colors border border-border/50 px-2 py-0.5 rounded-sm">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
