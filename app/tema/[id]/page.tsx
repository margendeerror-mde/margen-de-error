import { getAllTopics, getPiecesByTopic, getTopicById } from '@/lib/content';
import { FORMATS } from '@/lib/types';
import FormatColumn from '@/components/FormatColumn';
import { notFound } from 'next/navigation';

export default function TopicPage({ 
  params,
  searchParams
}: { 
  params: { id: string },
  searchParams: { tag?: string; q?: string }
}) {
  const topic = getTopicById(params.id);
  
  if (!topic) {
    notFound();
  }

  let pieces = getPiecesByTopic(topic.id);

  // Apply filters
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
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4 text-sm font-mono text-muted uppercase tracking-wider">
          <span>Tema</span>
          <span className="w-8 h-[1px] bg-border"></span>
        </div>
        <h1 className="font-serif text-5xl md:text-7xl text-foreground mb-6">
          {topic.name}
        </h1>
        <p className="text-xl md:text-2xl text-muted max-w-3xl leading-relaxed mb-6">
          {topic.description}
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

      {/* The 3-column layout for Formats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <FormatColumn format={FORMATS.historia} pieces={pieces.filter(p => p.format === 'historia')} />
        <FormatColumn format={FORMATS.conflicto} pieces={pieces.filter(p => p.format === 'conflicto')} />
        <FormatColumn format={FORMATS.microanalisis} pieces={pieces.filter(p => p.format === 'microanalisis')} />
      </div>
    </div>
  );
}
