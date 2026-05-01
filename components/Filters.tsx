'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { getAvailableTags } from '@/lib/content';

export default function Filters({ tags }: { tags: ReturnType<typeof getAvailableTags> }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.get(key)?.split(',') || [];
    
    if (currentValues.includes(value)) {
      const updated = currentValues.filter(v => v !== value);
      if (updated.length > 0) params.set(key, updated.join(','));
      else params.delete(key);
    } else {
      params.set(key, [...currentValues, value].join(','));
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const isSelected = (key: string, value: string) => {
    const currentValues = searchParams.get(key)?.split(',') || [];
    return currentValues.includes(value);
  };

  const FilterRow = ({ label, keyName, options }: { label: string, keyName: string, options: string[] }) => (
    <div className="flex gap-4 items-baseline py-2 overflow-x-auto scrollbar-hide">
      <span className="tag-text !text-muted shrink-0 w-24">{label}:</span>
      <div className="flex gap-x-6 gap-y-2 flex-wrap">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => handleFilter(keyName, opt)}
            className={`tag-text transition-colors whitespace-nowrap ${isSelected(keyName, opt) ? 'text-accent' : 'hover:text-accent'}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="px-4 py-8 border-b border-border/30 bg-background/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col gap-1">
        <FilterRow label="INDUSTRIA" keyName="industria" options={tags.industrias} />
        <FilterRow label="MECANISMO" keyName="mecanismo" options={tags.mecanismos} />
        <FilterRow label="TEMA" keyName="tema" options={tags.temas} />
      </div>
    </div>
  );
}
