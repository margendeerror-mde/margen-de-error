'use client';

import { useState } from 'react';
import NewsletterArchive from './NewsletterArchive';

export default function Newsletter() {
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
    <section id="newsletter" className="bg-[#0A0A0A] text-[#FAFAF8] py-24 px-6 border-y border-white/5">
      <div className="max-w-[680px] mx-auto text-center">
        <h2 className="font-serif text-[clamp(1.8rem,4vw,2.5rem)] leading-tight mb-6 font-bold tracking-tight">
          Menos ruido, más método.
        </h2>
        <p className="font-serif text-lg text-[#999] mb-12 italic leading-relaxed">
          Recibe cada semana un análisis sobre los sesgos, errores y serendipias que definen el conocimiento científico actual.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="email"
            placeholder="Tu email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-transparent border-b border-white/20 py-4 px-2 font-serif text-lg focus:outline-none focus:border-white transition-colors w-full"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="tag-text !text-[12px] bg-white text-black px-8 py-4 hover:bg-accent hover:text-white transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {status === 'loading' ? 'ENVIANDO...' : 'SUSCRIBIRME'}
          </button>
        </form>

        {status === 'success' && (
          <p className="mt-8 text-accent font-serif italic text-sm animate-fade-in">
            ¡Gracias! Revisa tu correo para confirmar la suscripción.
          </p>
        )}
        {status === 'error' && (
          <p className="mt-8 text-accent font-serif italic text-sm">
            Algo salió mal. Por favor intenta de nuevo.
          </p>
        )}

        <NewsletterArchive />
      </div>
    </section>
  );
}
