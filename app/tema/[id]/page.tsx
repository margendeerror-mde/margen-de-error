import { getAllTopics, getPiecesByTopic, getTopicById } from '@/lib/content';
import { FORMATS, FormatId } from '@/lib/types';
import FormatColumn from '@/components/FormatColumn';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const topics = getAllTopics();
  return topics.map((topic) => ({
    id: topic.id,
  }));
}

export default function TopicPage({ params }: { params: { id: string } }) {
  const topic = getTopicById(params.id);
  
  if (!topic) {
    notFound();
  }

  const pieces = getPiecesByTopic(topic.id);

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
        <p className="text-xl md:text-2xl text-muted max-w-3xl leading-relaxed">
          {topic.description}
        </p>
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
