'use client';

import dynamic from 'next/dynamic';
import { getPiezas } from '@/lib/content';
import GlobalMenu from '@/components/GlobalMenu';
import { useEffect, useState } from 'react';
import { Pieza } from '@/lib/types';

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
    // Fetch pieces on client side to ensure data is ready for D3
    fetch('/api/content')
      .then(res => res.json())
      .then(data => setPiezas(data));
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0A0A0A]">
      <GlobalMenu dark />
      {piezas.length > 0 && <NetworkMap piezas={piezas} />}
    </div>
  );
}
