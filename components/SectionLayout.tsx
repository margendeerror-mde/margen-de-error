import { Pieza, SECCION_COLORS } from '@/lib/types';
import PieceCard from '@/components/PieceCard';
import GlobalMenu from '@/components/GlobalMenu';

interface SectionLayoutProps {
  title: string;
  description: string;
  seccion: string;
  piezas: Pieza[];
}

export default function SectionLayout({ title, description, seccion, piezas }: SectionLayoutProps) {
  const accentColor = SECCION_COLORS[seccion] || '#000000';

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen bg-[#FAFAF8] text-[#0A0A0A] font-sans">
      <GlobalMenu />
      
      <header className="mb-24 mt-12">
        <span 
          className="tag-text !text-[11px] block mb-4 tracking-[0.2em] font-bold"
          style={{ color: accentColor }}
        >
          {title.toUpperCase()}
        </span>
        <p className="font-serif text-xl md:text-2xl text-[#666] leading-tight max-w-2xl">
          {description}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
        {piezas.map(pieza => (
          <PieceCard key={pieza.slug} pieza={pieza} />
        ))}
      </div>
    </div>
  );
}
