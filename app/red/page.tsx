import { getPiezas } from '@/lib/content';
import NetworkMap from '@/components/NetworkMap';

export const metadata = {
  title: 'Red Interactiva | Margen de Error',
};

export default function RedPage() {
  const piezas = getPiezas();

  return (
    <div className="w-full">
      <NetworkMap piezas={piezas} />
    </div>
  );
}
