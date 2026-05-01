import { getPiezas } from '@/lib/content';
import PieceCard from '@/components/PieceCard';
import Link from 'next/link';

export default function Home() {
  const todasLasPiezas = getPiezas();
  
  // Categorize for home display
  const secciones = ['historia', 'conflicto', 'serendipia', 'análisis', 'marco'];
  
  return (
    <div className="max-w-7xl mx-auto pb-48">
      {/* Featured Loop */}
      <div className="px-4 py-24 space-y-32">
        {secciones.map(sec => {
          const piezasSeccion = todasLasPiezas.filter(p => p.seccion === sec).slice(0, 3);
          if (piezasSeccion.length === 0) return null;

          return (
            <section key={sec} className="space-y-12">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="tag-text !text-[12px] text-accent tracking-[0.3em] font-bold">{sec}</h2>
                <div className="flex-1 h-[1px] bg-border/20" />
                <Link href={`/${sec}`} className="tag-text !text-[9px] text-muted hover:text-accent">VER TODO →</Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                {piezasSeccion.map((pieza, idx) => (
                  <PieceCard key={pieza.slug} pieza={pieza} featured={idx === 0} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="mt-24 py-24 border-t border-border/30 flex justify-center bg-foreground text-background dark-mode">
        <Link href="/red" className="tag-text !text-[14px] tracking-[0.5em] hover:text-accent transition-colors">
          — ENTRAR EN LA RED DE CONEXIONES →
        </Link>
      </footer>
    </div>
  );
}
