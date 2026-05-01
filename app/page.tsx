import { getAllTopics, getAllPieces } from '@/lib/content';
import TopicCard from '@/components/TopicCard';

export const metadata = {
  title: 'Margen de Error',
  description: 'Un mapa de conocimiento sobre cómo se construye y distorsiona la ciencia.',
};

export default function Home({
  searchParams,
}: {
  searchParams: { tag?: string; q?: string }
}) {
  const topics = getAllTopics();
  let pieces = getAllPieces();

  // Apply filters globally
  if (searchParams.tag) {
    pieces = pieces.filter(p => p.tags.some(t => t.toLowerCase().replace(/ /g, '_') === searchParams.tag));
  }
  if (searchParams.q) {
    const q = searchParams.q.toLowerCase();
    pieces = pieces.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.summary.toLowerCase().includes(q)
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-16 border-b border-border pb-12">
        <h1 className="font-serif text-5xl md:text-7xl text-foreground mb-6">
          Margen de Error
        </h1>
        <p className="text-xl md:text-2xl text-muted max-w-3xl leading-relaxed mb-6">
          Explora cómo se construye, se distorsiona y se comunica la ciencia a través de temas específicos.
        </p>
        
        {/* Active Filters Display */}
        {(searchParams.tag || searchParams.q) && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-muted">Filtrando por:</span>
            {searchParams.tag && (
              <span className="text-xs font-mono uppercase bg-accent/10 text-accent border border-accent/20 px-2 py-1">
                #{searchParams.tag}
              </span>
            )}
            {searchParams.q && (
              <span className="text-xs font-mono bg-muted/20 text-foreground border border-border px-2 py-1">
                "{searchParams.q}"
              </span>
            )}
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map(topic => {
          const count = pieces.filter(p => p.topic_id === topic.id).length;
          return <TopicCard key={topic.id} topic={topic} pieceCount={count} />;
        })}
      </div>
    </div>
  );
}
