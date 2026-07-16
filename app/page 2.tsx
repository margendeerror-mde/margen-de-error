import Link from 'next/link';
import GlobalMenu from '@/components/GlobalMenu';

export default function Home() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#CC0000] overflow-hidden font-sans selection:bg-black selection:text-white">
      {/* We pass dark={false} to keep the text/logo black if that's what's intended, or let it default. The user asked for "logo en negro arriba a la izq" */}
      <GlobalMenu dark={false} activeIdx={0} forceHide={false} />

      <main className="w-full h-full relative flex flex-col items-center justify-center">
        
        {/* Texts from the previous Home */}
        <div className="text-center px-6 z-10 pt-12 md:pt-0 animate-fade-in-up">
          <h1 className="text-[clamp(3.5rem,15vw,10rem)] md:text-[clamp(4.5rem,12vw,12rem)] font-extrabold leading-[0.85] tracking-tighter uppercase text-black mb-8">
            MARGEN<br/>DE ERROR
          </h1>

          <div className="relative inline-block mb-24">
            <p className="font-serif text-xl md:text-2xl leading-snug max-w-[600px] mx-auto text-black">
              Un proyecto sobre cómo se construye, se distorsiona y se comunica el conocimiento científico.
            </p>
          </div>
        </div>

        {/* Buttons from the new Home */}
        <div className="animate-fade-in-up flex flex-col items-center gap-6 z-20" style={{ animationDelay: '0.2s' }}>
          <Link 
            href="/volumenes"
            className="group relative inline-flex items-center justify-center px-12 py-5 font-mono font-bold text-sm tracking-[0.2em] uppercase text-[#F4F4F0] bg-black border-2 border-black overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <span className="relative z-10 flex items-center gap-4">
              Explorar los Volúmenes
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </Link>
          
          <Link 
            href="/atlas"
            className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-black hover:bg-black hover:text-[#CC0000] px-4 py-2 transition-colors border-2 border-transparent hover:border-black"
          >
            CONSULTAR EL ATLAS DEL ERROR
          </Link>
        </div>

      </main>
    </div>
  );
}
