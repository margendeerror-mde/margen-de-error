'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartaPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-24 px-6 relative bg-[#FAFAF8] dark:bg-[#0A0A0A]">
      <div className="max-w-[540px] w-full mx-auto relative z-10">
        <Link href="/" className="inline-block mb-16 opacity-80 hover:opacity-100 transition-opacity">
          <div className="dark:hidden">
            <Image src="/assets/logo-black.png" alt="Margen de Error" width={140} height={40} className="object-contain" style={{ mixBlendMode: 'multiply' }} />
          </div>
          <div className="hidden dark:block">
            <Image src="/assets/logo-white.png" alt="Margen de Error" width={140} height={40} className="object-contain" style={{ mixBlendMode: 'screen' }} />
          </div>
        </Link>
        
        <article className="font-serif text-[1.15rem] leading-[1.8] text-[#333] dark:text-[#CCC] space-y-6">
          <p>Hola.</p>
          <p>
            Estoy armando un proyecto de periodismo e investigación llamado Margen de Error. Trabajo sobre cómo se construye la evidencia científica, los sesgos de publicación, la crisis de replicación, estudios clínicos, nutrición y temas similares.
          </p>
          <p>
            Si estos temas cruzan tu trabajo o te resultan de interés, me encantaría invitarte a leer y sumarte a la conversación.
          </p>
          <p className="pt-4">Un abrazo.</p>
        </article>

        <div className="mt-24 pt-12 border-t border-black/10 dark:border-white/10">
          {status === 'success' ? (
            <div className="animate-fade-in text-center space-y-2">
              <p className="font-serif italic text-accent text-lg">
                ¡Gracias por sumarte! Por favor revisa tu correo para confirmar la suscripción.
              </p>
              <p className="font-sans text-[11px] text-black/50 dark:text-white/50 tracking-wider">
                (puede haber llegado a tu carpeta de spam)
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <p className="font-sans text-[11px] tracking-widest uppercase font-bold text-black/50 dark:text-white/50">
                Recibir nuevos ensayos (cero spam)
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="email"
                  placeholder="Tu correo electrónico..."
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 w-full bg-transparent border-b border-black/20 dark:border-white/20 py-3 px-2 font-serif text-lg focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder:text-black/30 dark:placeholder:text-white/30"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full sm:w-auto font-sans text-[12px] tracking-widest uppercase font-bold border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black px-8 py-4 transition-all disabled:opacity-50"
                >
                  {status === 'loading' ? 'ENVIANDO...' : 'UNIRME'}
                </button>
              </div>
              {status === 'error' && (
                <p className="text-accent font-serif italic text-sm">
                  Algo salió mal procesando tu solicitud. Por favor intenta de nuevo.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
