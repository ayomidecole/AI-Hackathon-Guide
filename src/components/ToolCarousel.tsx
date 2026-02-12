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

  const navButtonStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-card)',
    borderColor: 'var(--border-muted)',
    color: 'var(--text-secondary)',
  };

  return (
    <div className="flex flex-col gap-6 max-md:gap-4">
      {/* Desktop: Prev | Card | Next. Mobile: Card on top, then Prev + dots + Next */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={!hasPrev}
          className="hidden md:flex shrink-0 w-10 h-10 rounded-xl items-center justify-center border transition-colors hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none"
          style={navButtonStyle}
          aria-label="Previous tool"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2} />
        </button>
        <div className="flex-1 min-w-0 max-md:order-first">
          <ToolCard tool={current} />
        </div>
        <div className="flex items-center justify-center gap-2 max-md:gap-3">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={!hasPrev}
            className="md:hidden shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-colors hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none touch-manipulation"
            style={navButtonStyle}
            aria-label="Previous tool"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2} />
          </button>
          <div className="flex items-center gap-1.5 md:hidden">
            <div className="flex gap-1.5">
              {tools.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={clsx(
                    'rounded-full transition-all duration-200 touch-manipulation',
                    i === index ? 'w-2.5 h-2.5' : 'w-2 h-2 opacity-70'
                  )}
                  style={{
                    backgroundColor: i === index ? 'var(--dot-active)' : 'var(--dot-inactive)',
                  }}
                  aria-label={`Go to tool ${i + 1}`}
                />
              ))}
            </div>
            <span className="text-xs text-[var(--text-muted)] tabular-nums">
              {index + 1}/{tools.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(tools.length - 1, i + 1))}
            disabled={!hasNext}
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-colors hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none max-md:touch-manipulation"
            style={navButtonStyle}
            aria-label="Next tool"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Homepage preview
        </p>
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-muted)',
          }}
        >
          <iframe
            src={current.url}
            title={`${current.name} homepage`}
            loading="lazy"
            className="block w-full h-56 md:h-72"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          If the preview is blocked, open the website in a new tab.
        </p>
      </div>

      {/* Dots + counter: visible on desktop only (mobile has inline dots above) */}
      <div className="hidden md:flex items-center justify-center gap-3">
        <div className="flex gap-1.5">
          {tools.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={clsx(
                'rounded-full transition-all duration-200',
                i === index ? 'w-2.5 h-2.5' : 'w-2 h-2 opacity-70 hover:opacity-100'
              )}
              style={{
                backgroundColor: i === index ? 'var(--dot-active)' : 'var(--dot-inactive)',
              }}
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
