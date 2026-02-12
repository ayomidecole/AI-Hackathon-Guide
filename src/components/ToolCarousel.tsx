import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import type { Tool } from '../content/sections';
import { ToolCard } from './ToolCard';

interface ToolCarouselProps {
  tools: Tool[];
}

export function ToolCarousel({ tools }: ToolCarouselProps) {
  const [index, setIndex] = useState(0);

  if (tools.length === 0) {
    return (
      <div className="py-12 text-center text-[var(--text-muted)] text-sm">
        More tools coming soon…
      </div>
    );
  }

  const current = tools[index];
  const hasPrev = index > 0;
  const hasNext = index < tools.length - 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-stretch gap-3">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={!hasPrev}
          className={clsx(
            'shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-colors',
            'bg-white/[0.04] border-white/[0.08] text-[var(--text-secondary)]',
            'hover:bg-white/[0.08] hover:text-[var(--text-primary)] hover:border-white/[0.12]',
            'disabled:opacity-40 disabled:pointer-events-none'
          )}
          aria-label="Previous tool"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2} />
        </button>

        <div className="flex-1 min-w-0">
          <ToolCard tool={current} />
        </div>

        <button
          type="button"
          onClick={() => setIndex((i) => Math.min(tools.length - 1, i + 1))}
          disabled={!hasNext}
          className={clsx(
            'shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-colors',
            'bg-white/[0.04] border-white/[0.08] text-[var(--text-secondary)]',
            'hover:bg-white/[0.08] hover:text-[var(--text-primary)] hover:border-white/[0.12]',
            'disabled:opacity-40 disabled:pointer-events-none'
          )}
          aria-label="Next tool"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>

      <div className="flex items-center justify-center gap-3">
        <div className="flex gap-1.5">
          {tools.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={clsx(
                'rounded-full transition-all duration-200',
                i === index
                  ? 'w-2.5 h-2.5 bg-cyan-400'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/50'
              )}
              aria-label={`Go to tool ${i + 1}`}
            />
          ))}
        </div>
        <span className="text-xs text-[var(--text-muted)] tabular-nums">
          {index + 1} / {tools.length}
        </span>
      </div>
    </div>
  );
}
