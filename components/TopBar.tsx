'use client';

import { Tag } from '@/lib/types';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function TopBar({ tags }: { tags: Tag[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="border-b border-border bg-background/95 backdrop-blur z-50 sticky top-0 py-4 px-6 md:px-12 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div className="flex gap-4 items-center w-full md:w-auto">
        <Link href="/" className="font-serif text-xl md:text-2xl whitespace-nowrap hover:text-accent transition-colors">
          Margen de Error
        </Link>
        <form onSubmit={handleSearch} className="flex-1 md:w-64">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/20 border border-border px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-accent transition-colors"
          />
        </form>
      </div>

      <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
        {tags.map(tag => {
          const isActive = currentTag === tag.id;
          const params = new URLSearchParams(searchParams.toString());
          if (isActive) {
            params.delete('tag');
          } else {
            params.set('tag', tag.id);
          }
          const href = `?${params.toString()}`;

          return (
            <Link
              key={tag.id}
              href={href}
              scroll={false}
              className={`whitespace-nowrap px-3 py-1 border text-xs font-mono uppercase tracking-wider transition-colors ${
                isActive 
                  ? 'border-accent bg-accent text-white' 
                  : 'border-border text-muted hover:border-foreground hover:text-foreground'
              }`}
            >
              {tag.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
