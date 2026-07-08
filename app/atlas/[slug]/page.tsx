import fs from 'fs';
import path from 'path';
import PiecePage from '@/components/PiecePage';
import { getPieza } from '@/lib/content';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const paths: { slug: string }[] = [];
  const archivoDir = path.join(process.cwd(), 'content', 'archivo');
  
  if (fs.existsSync(archivoDir)) {
    const files = fs.readdirSync(archivoDir)
      .filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
    
    files.forEach(file => {
      const rawSlug = file.replace(/\.mdx?$/, '');
      const slug = rawSlug.replace(/^e\d+-/, '');
      paths.push({
        slug
      });
    });
  }
  
  return paths;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pieza = getPieza('archivo', slug);
  
  if (!pieza || pieza.temporada) {
    // If it has a season, it shouldn't be accessed via /archivo/[slug]
    // The canonical url is /temporadas/[id]/[slug]
    notFound();
  }

  return <PiecePage params={{ slug }} />;
}
