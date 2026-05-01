import PiecePage from '@/components/PiecePage';
import { getPiezasBySeccion } from '@/lib/content';

export function generateStaticParams() {
  const piezas = getPiezasBySeccion('marco');
  return piezas.map((p) => ({
    slug: p.slug,
  }));
}

export default function Page({ params }: { params: { slug: string } }) {
  return <PiecePage params={params} seccionNormalizada="marco" />;
}
