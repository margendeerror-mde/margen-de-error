import { getAllPiezas } from '@/lib/content';
import { redirect } from 'next/navigation';

export default function LegacyRedirectPage({ params }: { params: { seccion: string, slug: string } }) {
  const { slug } = params;
  
  const allPiezas = getAllPiezas();
  
  // Clean up slug if it has e01- prefix, but also try to match exactly
  // since old URLs might have had the prefix or not.
  const matchedPieza = allPiezas.find(p => 
    p.slug === slug || 
    `e${String(p.capitulo).padStart(2, '0')}-${p.slug}` === slug ||
    p.slug === slug.replace(/^e\d+-/, '')
  );

  if (matchedPieza) {
    redirect(matchedPieza.href);
  } else {
    // If we can't find it, redirect to the home page or atlas
    redirect('/atlas');
  }
}
