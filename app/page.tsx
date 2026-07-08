import Link from 'next/link';
import Image from 'next/image';
import GlobalMenu from '@/components/GlobalMenu';

export default function Home() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#F0EDE8] overflow-hidden font-sans selection:bg-black selection:text-white">
      <GlobalMenu dark={false} activeIdx={0} forceHide={false} />

      <main className="w-full h-full relative flex flex-col items-center justify-center">
        
        <div className="text-center px-6 z-10 animate-fade-in-up">
          <div className="mb-8 flex justify-center">
            <Image
              src="/assets/logo-black.png"
              alt="Margen de Error"
              width={800}
              height={800}
              priority
              className="w-[clamp(280px,55vw,600px)] h-auto object-contain"
            />
          </div>

          <div className="relative inline-block mb-12">
            <p className="font-serif text-xl md:text-2xl leading-snug max-w-[600px] mx-auto text-black/70">
              Un proyecto sobre cómo se construye, se distorsiona y se comunica el conocimiento científico.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="animate-fade-in-up flex flex-col items-center gap-6 z-20" style={{ animationDelay: '0.2s' }}>
          <Link 
            href="/volumenes"
            className="group relative inline-flex items-center justify-center px-12 py-5 font-mono font-bold text-sm tracking-[0.2em] uppercase text-[#F0EDE8] bg-black border-2 border-black overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
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
            className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-black hover:bg-black hover:text-[#F0EDE8] px-4 py-2 transition-colors border-2 border-transparent hover:border-black"
          >
            CONSULTAR EL ATLAS DEL ERROR
          </Link>
        </div>

      </main>
    </div>
  );
}
