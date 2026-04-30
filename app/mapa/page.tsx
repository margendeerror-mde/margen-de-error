import { getAllPiezas } from '@/lib/content';
import MapaGrid from '@/components/MapaGrid';

export const metadata = {
  title: 'Mapa de Etiquetas - Margen de Error',
  description: 'Visualización de cómo se cruzan las industrias y los mecanismos en nuestras piezas.',
};

export default function MapaPage() {
  const piezas = getAllPiezas();

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-16 border-b border-border pb-12">
        <h1 className="font-serif text-5xl md:text-7xl text-foreground mb-6">
          Mapa de Etiquetas
        </h1>
        <p className="text-xl md:text-2xl text-muted max-w-3xl leading-relaxed">
          Explorá cómo se cruzan las distintas industrias con los mecanismos de distorsión documentados en el archivo.
        </p>
      </header>

      <MapaGrid piezas={piezas} />
    </div>
  );
}
