import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Tool } from '../content/sections';
import { ToolCard } from './ToolCard';

interface ToolCarouselProps {
  tools: Tool[];
}

export function ToolCarousel({ tools }: ToolCarouselProps) {
  const [index, setIndex] = useState(0);

  if (tools.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 italic">
        More tools coming soon...
      </div>
    );
  }

  const current = tools[index];
  const hasPrev = index > 0;
  const hasNext = index < tools.length - 1;

  return (
    <div className="flex flex-col items-stretch gap-4 py-4">
      <div className="flex items-center gap-4 w-full">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={!hasPrev}
          className="shrink-0 p-2 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-emerald-500/30 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Previous tool"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex-1 min-w-0">
          <ToolCard tool={current} />
        </div>

        <button
          type="button"
          onClick={() => setIndex((i) => Math.min(tools.length - 1, i + 1))}
          disabled={!hasNext}
          className="shrink-0 p-2 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-emerald-500/30 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Next tool"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="flex justify-center gap-2">
        {tools.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={i === index
              ? 'w-2.5 h-2.5 rounded-full bg-emerald-400'
              : 'w-2 h-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors'
            }
            aria-label={`Go to tool ${i + 1}`}
          />
        ))}
      </div>
      <p className="text-center text-xs text-slate-500">
        {index + 1} of {tools.length}
      </p>
    </div>
  );
}
