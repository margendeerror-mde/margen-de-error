'use client';

import { useState } from 'react';
import Link from 'next/link';
import GlobalMenu from '@/components/GlobalMenu';

export default function SocialTriggerPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; post?: string } | null>(null);

  const handleTrigger = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/trigger-social', { method: 'POST' });
      const data = await res.json();
      
      if (res.ok) {
        setResult({ success: true, message: data.message, post: data.post });
      } else {
        setResult({ success: false, message: data.error || 'Error desconocido' });
      }
    } catch (error) {
      setResult({ success: false, message: 'Error de red o de conexión.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] font-sans selection:bg-[#333333] selection:text-white">
      <GlobalMenu dark={true} />
      
      <main className="max-w-2xl mx-auto pt-32 px-6">
        <div className="mb-12">
          <Link href="/" className="inline-block mb-8">
            <h1 className="tag-text !text-[11px] tracking-[0.2em] font-bold text-white/40 hover:text-white transition-colors">
              ← VOLVER
            </h1>
          </Link>
          
          <h2 className="text-3xl font-light tracking-tight mb-4">
            Distribución Social
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            Este botón mágico obtiene el último newsletter enviado en Beehiiv, extrae su contenido y lo empuja a Make.com para generar los borradores en Buffer. Usa esto si la automatización nativa de Beehiiv no dispara.
          </p>

          <div className="bg-[#111] border border-white/10 p-8 rounded-lg flex flex-col items-center justify-center min-h-[300px]">
            <button
              onClick={handleTrigger}
              disabled={loading}
              className={`px-8 py-4 rounded-full font-medium tracking-wide transition-all duration-300 ${
                loading 
                  ? 'bg-white/10 text-white/40 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(255,255,255,0.1)]'
              }`}
            >
              {loading ? 'CONECTANDO CON BEEHIIV...' : 'EMPUJAR ÚLTIMO POST A MAKE'}
            </button>

            {result && (
              <div className={`mt-8 p-4 w-full rounded-md border text-sm ${
                result.success 
                  ? 'bg-green-950/30 border-green-500/30 text-green-400' 
                  : 'bg-red-950/30 border-red-500/30 text-red-400'
              }`}>
                <div className="font-medium mb-1">
                  {result.success ? '¡Éxito!' : 'Error'}
                </div>
                <div>{result.message}</div>
                {result.post && (
                  <div className="mt-2 text-white/60 text-xs">
                    Artículo procesado: <span className="text-white/80">"{result.post}"</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
