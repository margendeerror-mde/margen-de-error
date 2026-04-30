import { Format, Piece } from '@/lib/types';
import PieceCard from './PieceCard';

const FORMAT_COLORS = {
  historia: "border-blue-900/30 text-blue-800",
  conflicto: "border-red-900/30 text-red-800",
  microanalisis: "border-emerald-900/30 text-emerald-800",
};

export default function FormatColumn({ format, pieces }: { format: Format, pieces: Piece[] }) {
  const colorClass = FORMAT_COLORS[format.id];

  return (
    <div className="flex flex-col border border-border bg-background/50">
      <div className={`p-6 border-b border-border bg-muted/5`}>
        <h3 className={`font-serif text-2xl mb-2 ${colorClass}`}>
          {format.name}
        </h3>
        <p className="text-sm text-muted">
          {format.description}
        </p>
      </div>
      
      <div className="flex-1 flex flex-col">
        {pieces.length > 0 ? (
          pieces.map(piece => (
            <PieceCard key={piece.id} piece={piece} />
          ))
        ) : (
          <div className="p-8 text-center text-muted/50 text-sm font-mono italic">
            Aún no hay piezas en este formato.
          </div>
        )}
      </div>
    </div>
  );
}
