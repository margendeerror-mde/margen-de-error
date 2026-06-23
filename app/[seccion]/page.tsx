import { getPiezasBySeccion } from '@/lib/content';
import SectionLayout from '@/components/SectionLayout';
import PodcastLayout from '@/components/PodcastLayout';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return [
    { seccion: 'historias' },
    { seccion: 'conflictos' },
    { seccion: 'serendipia' },
    { seccion: 'analisis' },
    { seccion: 'marco' },
    { seccion: 'podcast' },
  ];
}

const SECCION_INFO: Record<string, { title: string, description: string }> = {
  historias: {
    title: 'HISTORIAS',
    description: 'Relatos sobre cómo la ciencia se equivoca y cómo lo descubrimos.'
  },
  conflictos: {
    title: 'CONFLICTOS',
    description: 'Investigaciones sobre conclusiones demasiado convenientes para quienes las financiaron.'
  },
  serendipia: {
    title: 'SERENDIPIA',
    description: 'Lo que la ciencia encontró sin buscar, a pesar de los sesgos y las expectativas.'
  },
  analisis: {
    title: 'ANÁLISIS',
    description: 'Lecturas profundas de papers y datos que cuentan una historia diferente a la oficial.'
  },
  marco: {
    title: 'MARCO',
    description: 'Explorando la máquina que produce conocimiento: incentivos, instituciones y metodologías.'
  },
  podcast: {
    title: 'PODCAST',
    description: 'Versión en audio de nuestros artículos y análisis sobre ciencia, incentivos y conflictos.'
  }
};

export default async function SectionPage({ params }: { params: Promise<{ seccion: string }> }) {
  const { seccion } = await params;
  const info = SECCION_INFO[seccion];
  
  if (!info) {
    notFound();
  }

  const piezas = getPiezasBySeccion(seccion);

  if (seccion === 'podcast') {
    return (
      <PodcastLayout 
        title={info.title}
        description={info.description}
        piezas={piezas as any}
        seccion={seccion}
      />
    );
  }

  return (
    <SectionLayout 
      title={info.title}
      description={info.description}
      piezas={piezas as any}
      seccion={seccion}
    />
  );
}
