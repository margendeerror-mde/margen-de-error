import { getAllTags, getPiecesByTag } from '@/lib/content';
import { FORMATS } from '@/lib/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PieceCard from '@/components/PieceCard';

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    id: tag.id,
  }));
}

export default function TagPage({ params }: { params: { id: string } }) {
  const tags = getAllTags();
  const tag = tags.find(t => t.id === params.id);
  
  if (!tag) {
    notFound();
  }

  const pieces = getPiecesByTag(tag.id);

  // Group pieces by topic
  const piecesByTopic = pieces.reduce((acc, piece) => {
    if (!acc[piece.topic_id]) acc[piece.topic_id] = [];
    acc[piece.topic_id].push(piece);
    return acc;
  }, {} as Record<string, typeof pieces>);

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-16 border-b border-border pb-12 text-center">
        <div className="flex items-center justify-center gap-4 mb-6 text-sm font-mono text-muted uppercase tracking-wider">
          <span className="w-8 h-[1px] bg-border"></span>
          <span>Patrón Sistémico</span>
          <span className="w-8 h-[1px] bg-border"></span>
        </div>
        <h1 className="font-serif text-5xl md:text-7xl text-foreground mb-6">
          #{tag.name}
        </h1>
        <p className="text-xl md:text-2xl text-muted max-w-3xl mx-auto leading-relaxed">
          Explorando cómo este mecanismo se repite a través de diferentes temas e industrias.
        </p>
      </header>

      <div className="space-y-16">
        {Object.entries(piecesByTopic).map(([topicId, topicPieces]) => (
          <section key={topicId} className="border border-border p-8 bg-background/50">
            <h2 className="font-serif text-3xl mb-8 capitalize flex items-center gap-4">
              <span className="text-muted">Tema:</span>
              <Link href={`/tema/${topicId}`} className="text-foreground hover:text-accent transition-colors">
                {topicId.replace(/-/g, ' ')}
              </Link>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topicPieces.map(piece => (
                <div key={piece.id} className="relative">
                  <div className="absolute top-0 right-0 p-2 z-10 pointer-events-none">
                    <span className="text-[10px] uppercase font-mono px-2 py-1 bg-background border border-border text-muted shadow-sm">
                      {FORMATS[piece.format].name}
                    </span>
                  </div>
                  <PieceCard piece={piece} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
