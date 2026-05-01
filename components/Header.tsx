import Link from 'next/link';

export default function Header() {
  return (
    <header className="py-8 px-4 flex justify-center border-b border-border/50">
      <Link href="/" className="tag-text !text-[11px] tracking-[0.4em] font-medium hover:text-accent transition-colors">
        MARGEN DE ERROR
      </Link>
    </header>
  );
}
