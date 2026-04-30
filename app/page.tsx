import { getAllPiezas } from '@/lib/content';
import PiezaDestacada from '@/components/PiezaDestacada';
import HomeFeed from '@/components/HomeFeed';

export default function Home() {
  const todasLasPiezas = getAllPiezas();
  
  if (todasLasPiezas.length === 0) {
    return (
      <div className="py-32 text-center">
        <h2 className="font-serif text-4xl mb-6 text-foreground">Todavía no hay publicaciones.</h2>
        <p className="text-muted text-lg">Añadí archivos Markdown en la carpeta /content para empezar.</p>
      </div>
    );
  }

  // La pieza más reciente es la destacada
  const destacada = todasLasPiezas[0];
  // El resto van al feed
  const resto = todasLasPiezas.slice(1);

  return (
    <div className="animate-in fade-in duration-700">
      <PiezaDestacada pieza={destacada} />
      {resto.length > 0 && <HomeFeed initialPiezas={resto} />}
    </div>
  );
}
