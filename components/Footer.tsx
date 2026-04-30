import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="max-w-sm">
          <Link href="/" className="inline-block mb-4">
            <h2 className="font-serif text-2xl text-foreground">
              Margen de Error
            </h2>
          </Link>
          <p className="text-muted text-sm leading-relaxed">
            Periodismo científico independiente. Exploramos cómo se construye, 
            se distorsiona y se comunica la ciencia. Lo que los papers no dicen.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-wider font-medium text-foreground mb-2">
            Secciones
          </span>
          <Link href="/historias" className="text-muted hover:text-accent transition-colors">Historias</Link>
          <Link href="/conflictos" className="text-muted hover:text-accent transition-colors">Conflictos</Link>
          <Link href="/serendipia" className="text-muted hover:text-accent transition-colors">Serendipia</Link>
          <Link href="/analisis" className="text-muted hover:text-accent transition-colors">Análisis</Link>
          <Link href="/marco" className="text-muted hover:text-accent transition-colors">Marco</Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-wider font-medium text-foreground mb-2">
            Proyecto
          </span>
          <Link href="/mapa" className="text-muted hover:text-accent transition-colors">Mapa de Etiquetas</Link>
          <span className="text-muted mt-4">
            © {new Date().getFullYear()} Margen de Error.
          </span>
        </div>
      </div>
    </footer>
  );
}
