import fs from 'fs';
import path from 'path';
import PiecePage from '@/components/PiecePage';
import { getPieza } from '@/lib/content';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const paths: { id: string; slug: string }[] = [];
  const volumenesDir = path.join(process.cwd(), 'content', 'volumenes');
  
  if (fs.existsSync(volumenesDir)) {
    const seasons = fs.readdirSync(volumenesDir);
    for (const season of seasons) {
      const seasonPath = path.join(volumenesDir, season);
      if (fs.statSync(seasonPath).isDirectory()) {
        const files = fs.readdirSync(seasonPath)
          .filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
        
        files.forEach(file => {
          const rawSlug = file.replace(/\.mdx?$/, '');
          const slug = rawSlug.replace(/^e\d+-/, ''); // strips e01- if present
          paths.push({
            id: season,
            slug
          });
        });
      }
    }
  }
  
  return paths;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id, slug } = await params;
  const pieza = getPieza(id, slug);
  if (!pieza) return {};

  return {
    title: `${pieza.titulo} | Margen de Error`,
    description: pieza.resumen,
    openGraph: {
      title: pieza.titulo,
      description: pieza.resumen,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: pieza.titulo,
      description: pieza.resumen,
    }
  };
}

export default async function Page({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id, slug } = await params;
  const pieza = getPieza(id, slug);
  
  if (!pieza || String(pieza.temporada) !== id) {
    notFound();
  }

  return <PiecePage params={{ slug }} temporadaId={id} />;
}
