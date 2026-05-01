import { getPiezas } from '@/lib/content';
import NetworkMap from '@/components/NetworkMap';
import GlobalMenu from '@/components/GlobalMenu';

export default function RedPage() {
  const piezas = getPiezas();

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0A0A0A]">
      <GlobalMenu dark />
      <NetworkMap piezas={piezas} />
    </div>
  );
}
