import { getAllPiezas, getAvailableTags } from '@/lib/content';
import AtlasRedController from './AtlasRedController';

import { getAtlasTipo } from '@/lib/types';
import type { AtlasMecanismo } from '@/lib/types';

export default async function AtlasPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const todasLasPiezas = getAllPiezas();
  const tags = getAvailableTags(todasLasPiezas);
  const resolvedParams = await searchParams;

  let initialFilter: { tipo: 'distorsión' | 'límite' | 'industria' | 'tema' | null, valor: string | null } = { tipo: null, valor: null };
  if (resolvedParams?.tema) {
    initialFilter = { tipo: 'tema', valor: resolvedParams.tema as string };
  } else if (resolvedParams?.industria) {
    initialFilter = { tipo: 'industria', valor: resolvedParams.industria as string };
  } else if (resolvedParams?.atlas) {
    const val = resolvedParams.atlas as string;
    initialFilter = { tipo: getAtlasTipo(val as AtlasMecanismo), valor: val };
  }

  return (
    <AtlasRedController piezas={todasLasPiezas} tags={tags} initialFilter={initialFilter} />
  );
}
