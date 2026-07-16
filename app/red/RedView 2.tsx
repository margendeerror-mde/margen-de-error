'use client';

import dynamic from 'next/dynamic';

const NetworkMap = dynamic(() => import('@/components/NetworkMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen flex items-center justify-center bg-[#0A0A0A]">
      <span className="tag-text !text-white/20 animate-pulse">CARGANDO RED...</span>
    </div>
  )
});

export default function RedView({ piezas }: { piezas: any[] }) {
  return <NetworkMap piezas={piezas} />;
}
