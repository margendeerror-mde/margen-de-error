import fs from 'fs';
import path from 'path';
import PiecePage from '@/components/PiecePage';
import { getPieza } from '@/lib/content';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const secciones = ['historias', 'conflictos', 'serendipia', 'analisis', 'marco'];
  const paths: { seccion: string; slug: string }[] = [];

  for (const seccion of secciones) {
    const contentDir = path.join(process.cwd(), 'content', seccion);
    if (fs.existsSync(contentDir)) {
      const files = fs.readdirSync(contentDir)
        .filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
      
      files.forEach(file => {
        paths.push({
          seccion,
          slug: file.replace(/\.mdx?$/, '')
        });
      });
    }
  }
  
  return paths;
}

export default async function Page({ params }: { params: Promise<{ seccion: string; slug: string }> }) {
  const { seccion, slug } = await params;
  const pieza = getPieza(seccion, slug);
  
  if (!pieza) {
    notFound();
  }

  return <PiecePage params={{ slug }} seccionNormalizada={seccion} />;
}
