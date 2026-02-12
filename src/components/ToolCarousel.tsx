import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import type { Tool } from '../content/sections';
import { ToolCard } from './ToolCard';

interface ToolCarouselProps {
  tools: Tool[];
}

const EXIT_DURATION_MS = 170;
const ENTER_DURATION_MS = 220;

export function ToolCarousel({ tools }: ToolCarouselProps) {
  const [index, setIndex] = useState(0);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [animationStage, setAnimationStage] = useState<'idle' | 'out' | 'in'>('idle');
  const toolCount = tools.length;
  const activeIndex = toolCount === 0 ? 0 : Math.min(index, toolCount - 1);
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < toolCount - 1;
  const isAnimating = animationStage !== 'idle';
  const minSwipeDistance = 48;

  useEffect(() => {
    if (toolCount > 0 && index > toolCount - 1) {
      setIndex(toolCount - 1);
      return;
    }

    if (toolCount === 0) {
      if (index !== 0) setIndex(0);
      if (pendingIndex !== null) setPendingIndex(null);
      if (animationStage !== 'idle') setAnimationStage('idle');
    }
  }, [toolCount, index, pendingIndex, animationStage]);

  useEffect(() => {
    if (animationStage !== 'out') return;

    const timer = window.setTimeout(() => {
      if (pendingIndex === null) {
        setAnimationStage('idle');
        return;
      }

      setIndex(pendingIndex);
      setAnimationStage('in');
    }, EXIT_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [animationStage, pendingIndex]);

  useEffect(() => {
    if (animationStage !== 'in') return;

    const timer = window.setTimeout(() => {
      setAnimationStage('idle');
      setPendingIndex(null);
    }, ENTER_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [animationStage]);

  if (toolCount === 0) {
    return (
      <div className="py-12 text-center text-[var(--text-muted)] text-sm">
        More tools coming soon…
      </div>
    );
  }

  const current = tools[activeIndex];

  const navigateTo = (nextIndex: number) => {
    if (isAnimating) return;

    const clamped = Math.max(0, Math.min(toolCount - 1, nextIndex));
    if (clamped === activeIndex) return;

    setSlideDirection(clamped > activeIndex ? 1 : -1);
    setPendingIndex(clamped);
    setAnimationStage('out');
  };

  const goPrev = () => {
    navigateTo(activeIndex - 1);
  };

  const goNext = () => {
    navigateTo(activeIndex + 1);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1) {
      swipeStartRef.current = null;
      return;
    }

    const touch = event.touches[0];
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (isAnimating) return;

    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start || event.changedTouches.length === 0) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX < minSwipeDistance || absX <= absY) return;

    if (deltaX > 0) {
      goPrev();
    } else {
      goNext();
    }
  };

  const navButtonStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-card)',
    borderColor: 'var(--border-muted)',
    color: 'var(--text-secondary)',
  };

  const cardAnimationClass =
    animationStage === 'out'
      ? slideDirection === 1
        ? 'tool-card-slide-out-left'
        : 'tool-card-slide-out-right'
      : animationStage === 'in'
        ? slideDirection === 1
          ? 'tool-card-slide-in-right'
          : 'tool-card-slide-in-left'
        : '';

  return (
    <div className="flex flex-col gap-6 max-md:gap-4">
      {/* Desktop: Prev | Card | Next. Mobile: Card on top, then Prev + dots + Next */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={!hasPrev || isAnimating}
          className="hidden md:flex shrink-0 w-10 h-10 rounded-xl items-center justify-center border transition-colors hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none"
          style={navButtonStyle}
          aria-label="Previous tool"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2} />
        </button>
        <div
          className={clsx('flex-1 min-w-0 max-md:order-first', cardAnimationClass)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'pan-y' }}
        >
          <ToolCard tool={current} />
        </div>
        <div className="flex items-center justify-center gap-2 max-md:gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={!hasPrev || isAnimating}
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
                  onClick={() => navigateTo(i)}
                  disabled={isAnimating}
                  className={clsx(
                    'rounded-full transition-all duration-200 touch-manipulation disabled:pointer-events-none',
                    i === activeIndex ? 'w-2.5 h-2.5' : 'w-2 h-2 opacity-70'
                  )}
                  style={{
                    backgroundColor: i === activeIndex ? 'var(--dot-active)' : 'var(--dot-inactive)',
                  }}
                  aria-label={`Go to tool ${i + 1}`}
                />
              ))}
            </div>
            <span className="text-xs text-[var(--text-muted)] tabular-nums">
              {activeIndex + 1}/{toolCount}
            </span>
          </div>
          <button
            type="button"
            onClick={goNext}
            disabled={!hasNext || isAnimating}
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-colors hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none max-md:touch-manipulation"
            style={navButtonStyle}
            aria-label="Next tool"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Dots + counter: visible on desktop only (mobile has inline dots above) */}
      <div className="hidden md:flex items-center justify-center gap-3">
        <div className="flex gap-1.5">
          {tools.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => navigateTo(i)}
              disabled={isAnimating}
              className={clsx(
                'rounded-full transition-all duration-200 disabled:pointer-events-none',
                i === activeIndex ? 'w-2.5 h-2.5' : 'w-2 h-2 opacity-70 hover:opacity-100'
              )}
              style={{
                backgroundColor: i === activeIndex ? 'var(--dot-active)' : 'var(--dot-inactive)',
              }}
              aria-label={`Go to tool ${i + 1}`}
            />
          ))}
        </div>
        <span className="text-xs text-[var(--text-muted)] tabular-nums">
          {activeIndex + 1} / {toolCount}
        </span>
      </div>
    </div>
  );
}
