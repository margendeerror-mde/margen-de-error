'use client';

import dynamic from 'next/dynamic';
import GlobalMenu from '@/components/GlobalMenu';
import { useEffect, useState } from 'react';
import { Pieza } from '@/lib/types';
import Link from 'next/link';

const NetworkMap = dynamic(() => import('@/components/NetworkMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen flex items-center justify-center bg-[#0A0A0A]">
      <span className="tag-text !text-white/20 animate-pulse">CARGANDO RED...</span>
    </div>
  )
});

export default function RedPage() {
  const [piezas, setPiezas] = useState<Pieza[]>([]);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => setPiezas(data));
  }, []);

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

      {piezas.length > 0 && <NetworkMap piezas={piezas} />}
    </div>
  );
}
