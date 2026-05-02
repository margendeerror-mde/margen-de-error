import { getAllPiezas } from '@/lib/content';
import RedView from './RedView';
import GlobalMenu from '@/components/GlobalMenu';
import Link from 'next/link';

export default function RedPage() {
  const piezas = getAllPiezas();

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0A0A0A] relative">
      <GlobalMenu dark />
      
      {/* Header Overlay */}
      <div className="absolute top-8 left-8 z-[210] pointer-events-none">
        <Link href="/" className="pointer-events-auto">
          <h1 className="tag-text !text-[11px] tracking-[0.2em] font-bold text-white/40 hover:text-white transition-colors">
            MARGEN DE ERROR — RED DE CONEXIONES
          </h1>
        </Link>
      </div>

      <RedView piezas={piezas} />
    </div>
  );
}
