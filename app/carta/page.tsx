'use client';

import { useState } from 'react';
import Link from 'next/link';
import GlobalMenu from '@/components/GlobalMenu';

export default function AcercaDePage() {
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
    <div className="min-h-screen bg-[#F0EDE8] text-black font-sans selection:bg-black selection:text-white">
      <GlobalMenu dark={false} />
      
      <main className="max-w-screen-md mx-auto px-6 md:px-8 pt-32 pb-24">
        
        {/* Header */}
        <header className="mb-16 border-b-2 border-black pb-8">
          <h1 className="text-[clamp(3rem,8vw,6rem)] font-extrabold tracking-tighter uppercase leading-[0.85] mb-6">
            ACERCA DE
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
            Periodismo Científico Independiente
          </p>
        </header>

        {/* Content */}
        <article className="font-serif text-[1.15rem] leading-[1.85] text-[#333] space-y-8 mb-24">
          
          <p>
            Margen de Error es un proyecto de periodismo científico independiente. Investiga cómo se construye, se distorsiona y se comunica el conocimiento que usamos para tomar decisiones sobre salud, alimentación y políticas públicas.
          </p>

          <p>
            Cada episodio trabaja sobre un hecho o mecanismo concreto y lo explora hasta sus fuentes: los estudios originales, los diseños experimentales, los conflictos de interés y las decisiones institucionales que terminaron definiendo lo que hoy se acepta como evidencia. No se trata de desconfiar de la ciencia, sino de entender cómo funciona — y dónde falla.
          </p>

          <h2 className="font-sans text-sm font-bold uppercase tracking-widest pt-8 text-black">Qué contiene</h2>

          <p>
            El proyecto se organiza en <Link href="/volumenes" className="text-accent no-underline border-b border-accent/30 hover:border-accent transition-all">volúmenes temáticos</Link>. Cada volumen agrupa ensayos escritos y episodios sonoros alrededor de una tesis central. Los artículos incluyen las fuentes primarias citadas y, cuando el tema lo permite, visualizaciones interactivas que permiten explorar los datos directamente.
          </p>

          <p>
            El <Link href="/atlas" className="text-accent no-underline border-b border-accent/30 hover:border-accent transition-all">Atlas del Error</Link> funciona como un índice transversal: un catálogo de los mecanismos de distorsión y los límites epistemológicos que aparecen a lo largo de los episodios. No es un diccionario cerrado. Se construye con cada nuevo artículo.
          </p>

          <h2 className="font-sans text-sm font-bold uppercase tracking-widest pt-8 text-black">Quién lo hace</h2>

          <p>
            Margen de Error es un proyecto independiente. No tiene financiamiento institucional ni comercial. La investigación, la redacción, el diseño y la producción sonora los lleva adelante una sola persona con formación en Comunicación y Ciencia.
          </p>

          <h2 className="font-sans text-sm font-bold uppercase tracking-widest pt-8 text-black">Sumate a la conversación</h2>

          <p>
            Si estos temas cruzan tu trabajo o te resultan de interés, la mejor forma de seguir el proyecto es a través de la newsletter. Llega con cada nuevo ensayo publicado. Cero spam.
          </p>
        </article>

        {/* Newsletter Subscription */}
        <div className="border-t-2 border-black pt-12">
          {status === 'success' ? (
            <div className="animate-fade-in text-center space-y-2">
              <p className="font-serif italic text-accent text-lg">
                Gracias por sumarte. Revisá tu correo para confirmar la suscripción.
              </p>
              <p className="font-sans text-[11px] text-black/50 tracking-wider">
                (puede haber llegado a tu carpeta de spam)
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <p className="font-sans text-[11px] tracking-widest uppercase font-bold text-black/50">
                Recibir nuevos ensayos
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="email"
                  placeholder="Tu correo electrónico..."
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 w-full bg-transparent border-b-2 border-black/20 py-3 px-2 font-serif text-lg focus:outline-none focus:border-black transition-colors placeholder:text-black/30"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full sm:w-auto font-sans text-[12px] tracking-widest uppercase font-bold border-2 border-black hover:bg-black hover:text-[#F0EDE8] px-8 py-4 transition-all disabled:opacity-50"
                >
                  {status === 'loading' ? 'ENVIANDO...' : 'UNIRME'}
                </button>
              </div>
              {status === 'error' && (
                <p className="text-accent font-serif italic text-sm">
                  Algo salió mal procesando tu solicitud. Intentá de nuevo.
                </p>
              )}
            </form>
          )}
        </div>

        {/* Social links */}
        <div className="mt-16 pt-8 border-t border-black/10 flex gap-8">
          <Link href="https://www.linkedin.com/in/margen-de-error-mde/" target="_blank" rel="noopener noreferrer" className="tag-text !text-[10px] tracking-[0.1em] text-black/40 hover:text-accent transition-colors">
            [LINKEDIN]
          </Link>
          <Link href="https://x.com/mde_uy" target="_blank" rel="noopener noreferrer" className="tag-text !text-[10px] tracking-[0.1em] text-black/40 hover:text-accent transition-colors">
            [X / TWITTER]
          </Link>
        </div>

      </main>
    </div>
  );
}

