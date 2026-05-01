'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { getAvailableTags } from '@/lib/content';

export default function Filters({ tags }: { tags: ReturnType<typeof getAvailableTags> }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const isSelected = (key: string, value: string) => searchParams.get(key) === value;

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-4 border-b border-editorial p-4 bg-background z-40 sticky top-[53px]">
      <div className="flex gap-2 items-baseline">
        <span className="tag-text text-muted">Industria:</span>
        <div className="flex flex-wrap gap-2">
          {tags.industrias.map(ind => (
            <button
              key={ind}
              onClick={() => handleFilter('industria', ind)}
              className={`tag-text hover:text-accent transition-colors ${isSelected('industria', ind) ? 'text-accent font-bold border-b border-accent' : ''}`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2 items-baseline">
        <span className="tag-text text-muted">Mecanismo:</span>
        <div className="flex flex-wrap gap-2">
          {tags.mecanismos.map(mec => (
            <button
              key={mec}
              onClick={() => handleFilter('mecanismo', mec)}
              className={`tag-text hover:text-accent transition-colors ${isSelected('mecanismo', mec) ? 'text-accent font-bold border-b border-accent' : ''}`}
            >
              {mec}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2 items-baseline">
        <span className="tag-text text-muted">Tema:</span>
        <div className="flex flex-wrap gap-2">
          {tags.temas.map(tema => (
            <button
              key={tema}
              onClick={() => handleFilter('tema', tema)}
              className={`tag-text hover:text-accent transition-colors ${isSelected('tema', tema) ? 'text-accent font-bold border-b border-accent' : ''}`}
            >
              {tema}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
