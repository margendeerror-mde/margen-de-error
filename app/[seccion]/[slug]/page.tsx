import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPiezaBySlug, getAllPiezaSlugs, getAdjacentPiezas } from '@/lib/content';
import { Seccion, SECCIONES } from '@/lib/types';
import TagBadge from '@/components/TagBadge';
import PiezaNav from '@/components/PiezaNav';

interface Props {
  params: Promise<{ seccion: string; slug: string }>;
}

export async function generateStaticParams() {
  return getAllPiezaSlugs();
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const { seccion, slug } = resolvedParams;
  
  const pieza = getPiezaBySlug(seccion as Seccion, slug);
  if (!pieza) return { title: 'No encontrado' };
  
  return {
    title: `${pieza.titulo} - Margen de Error`,
    description: pieza.resumen,
  };
}

export default async function PiezaPage({ params }: Props) {
  const resolvedParams = await params;
  const { seccion, slug } = resolvedParams;
  
  if (!SECCIONES.includes(seccion as Seccion)) {
    notFound();
  }

  const pieza = getPiezaBySlug(seccion as Seccion, slug);
  
  if (!pieza) {
    notFound();
  }

  const date = new Date(pieza.fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const adjacent = getAdjacentPiezas(seccion as Seccion, slug);

  return (
    <article className="animate-in fade-in duration-700">
      <header className="mb-12 pb-12 border-b border-border text-center max-w-4xl mx-auto">
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          <TagBadge tipo="seccion" valor={pieza.seccion} />
          {pieza.industria && <TagBadge tipo="industria" valor={pieza.industria} />}
          {pieza.mecanismo.map(m => (
            <TagBadge key={m} tipo="mecanismo" valor={m} />
          ))}
        </div>
        
        <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl leading-[1.1] text-foreground mb-8">
          {pieza.titulo}
        </h1>
        
        <div className="flex flex-col items-center gap-6">
          <p className="text-xl md:text-2xl text-muted leading-relaxed max-w-2xl text-left italic">
            {pieza.resumen}
          </p>
          <time className="text-sm font-mono uppercase tracking-wider text-muted mt-2">
            {date}
          </time>
        </div>
      </header>

      <div className="prose prose-lg md:prose-xl mx-auto mb-20">
        <MDXRemote source={pieza.contenido} />
      </div>

      <PiezaNav prev={adjacent.prev} next={adjacent.next} />
    </article>
  );
}
