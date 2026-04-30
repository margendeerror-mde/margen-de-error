import { getAllTopics, getAllPieces } from '@/lib/content';
import TopicCard from '@/components/TopicCard';

export const metadata = {
  title: 'Margen de Error',
  description: 'Un mapa de conocimiento sobre cómo se construye y distorsiona la ciencia.',
};

export default function Home() {
  const topics = getAllTopics();
  const pieces = getAllPieces();

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-16 border-b border-border pb-12">
        <h1 className="font-serif text-5xl md:text-7xl text-foreground mb-6">
          Margen de Error
        </h1>
        <p className="text-xl md:text-2xl text-muted max-w-3xl leading-relaxed">
          Explora cómo se construye, se distorsiona y se comunica la ciencia a través de temas específicos.
        </p>
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
