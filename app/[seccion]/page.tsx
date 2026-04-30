import { notFound } from 'next/navigation';
import { getPiezasBySeccion } from '@/lib/content';
import { SECCIONES, SECCIONES_META, Seccion } from '@/lib/types';
import PiezaCard from '@/components/PiezaCard';

interface Props {
  params: Promise<{ seccion: string }>;
}

export async function generateStaticParams() {
  return SECCIONES.map((seccion) => ({
    seccion,
  }));
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const seccion = resolvedParams.seccion as Seccion;
  if (!SECCIONES.includes(seccion)) return { title: 'No encontrado' };
  
  return {
    title: `${SECCIONES_META[seccion].titulo} - Margen de Error`,
    description: SECCIONES_META[seccion].descripcion,
  };
}

export default async function SeccionPage({ params }: Props) {
  const resolvedParams = await params;
  const seccion = resolvedParams.seccion as Seccion;
  
  if (!SECCIONES.includes(seccion)) {
    notFound();
  }

  const meta = SECCIONES_META[seccion];
  const piezas = getPiezasBySeccion(seccion);

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-16 border-b border-border pb-12">
        <h1 className="font-serif text-5xl md:text-7xl text-foreground mb-6">
          {meta.titulo}
        </h1>
        <p className="text-xl md:text-2xl text-muted max-w-3xl leading-relaxed">
          {meta.descripcion}
        </p>
      </header>
      
      {piezas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {piezas.map(pieza => (
            <PiezaCard key={pieza.slug} pieza={pieza} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-muted border border-dashed border-border rounded-sm">
          <p className="font-serif text-2xl mb-2 text-foreground">Sección vacía</p>
          <p>Todavía no hay publicaciones en esta sección.</p>
        </div>
      )}
    </div>
  );
}
