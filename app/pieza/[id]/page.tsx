import { getAllPieces, getPieceById, getTopicById } from '@/lib/content';
import { FORMATS } from '@/lib/types';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const pieces = getAllPieces();
  return pieces.map((piece) => ({
    id: piece.id,
  }));
}

export default function PiecePage({ params }: { params: { id: string } }) {
  const piece = getPieceById(params.id);
  
  if (!piece) {
    notFound();
  }

  const topic = getTopicById(piece.topic_id);
  const format = FORMATS[piece.format];

  // Get related pieces by topic (excluding self)
  const relatedPieces = getAllPieces()
    .filter(p => p.topic_id === piece.topic_id && p.id !== piece.id)
    .slice(0, 3);

  return (
    <div className="animate-in fade-in duration-700 max-w-4xl mx-auto">
      <header className="mb-16 text-center">
        <div className="flex justify-center items-center gap-3 mb-8 text-xs font-mono uppercase tracking-wider">
          <Link href={`/tema/${topic?.id}`} className="text-muted hover:text-foreground transition-colors border-b border-transparent hover:border-foreground">
            {topic?.name}
          </Link>
          <span className="text-muted/30">/</span>
          <span className="text-accent">{format.name}</span>
        </div>
        
        <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-8 leading-tight">
          {piece.title}
        </h1>
        
        <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed italic">
          {piece.summary}
        </p>

        {piece.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {piece.tags.map(tag => (
              <Link key={tag} href={`/etiqueta/${tag.toLowerCase().replace(/ /g, '_')}`} className="text-xs uppercase tracking-wider font-mono text-muted hover:text-accent border border-border px-3 py-1 rounded-full transition-colors bg-background">
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      <article className="prose prose-lg prose-neutral prose-a:text-accent prose-a:no-underline hover:prose-a:border-b-accent prose-a:border-b prose-a:border-transparent prose-a:transition-all max-w-none mb-24">
        <MDXRemote source={piece.content_raw} />
      </article>

      {relatedPieces.length > 0 && (
        <section className="border-t border-border pt-16">
          <h3 className="font-serif text-3xl mb-8">Más sobre {topic?.name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedPieces.map(p => (
              <Link key={p.id} href={`/pieza/${p.id}`} className="group block p-5 border border-border hover:border-accent transition-colors bg-background">
                <span className="text-[10px] font-mono text-muted uppercase tracking-wider mb-2 block">{FORMATS[p.format].name}</span>
                <h4 className="font-serif text-xl group-hover:text-accent transition-colors mb-2 leading-tight">{p.title}</h4>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
