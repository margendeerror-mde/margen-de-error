import Link from 'next/link';
import { Topic } from '@/lib/types';

export default function TopicCard({ topic, pieceCount }: { topic: Topic, pieceCount: number }) {
  return (
    <Link 
      href={`/tema/${topic.id}`}
      className="group block p-8 border border-border hover:border-accent transition-colors bg-background relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-accent/20 group-hover:bg-accent transition-colors" />
      <h3 className="font-serif text-4xl text-foreground group-hover:text-accent transition-colors mb-4">
        {topic.name}
      </h3>
      <p className="text-muted text-base line-clamp-3 leading-relaxed mb-6">
        {topic.description}
      </p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs font-mono text-muted group-hover:text-foreground transition-colors">
          {pieceCount} piezas publicadas
        </span>
        <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  );
}
