import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import type { Tool } from '../content/sections';
import { ToolCard } from './ToolCard';

interface ToolCarouselProps {
  tools: Tool[];
  /** When true and section just opened, carousel will take focus for keyboard nav */
  isSectionOpen?: boolean;
}

const EXIT_DURATION_MS = 180;
const ENTER_DURATION_MS = 240;
const MOBILE_MEDIA_QUERY = '(max-width: 849px)';

export function ToolCarousel({ tools, isSectionOpen = false }: ToolCarouselProps) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
  });
  const [index, setIndex] = useState(0);
  const [cardExpanded, setCardExpanded] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !window.matchMedia(MOBILE_MEDIA_QUERY).matches;
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const prevSectionOpenRef = useRef(false);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [animationStage, setAnimationStage] = useState<'idle' | 'out' | 'in'>('idle');
  const toolCount = tools.length;
  const hasMultipleTools = toolCount > 1;
  const activeIndex = toolCount === 0 ? 0 : Math.min(index, toolCount - 1);
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < toolCount - 1;
  const isAnimating = animationStage !== 'idle';
  const minSwipeDistance = 48;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const applyViewportState = (matches: boolean) => {
      setIsMobile(matches);
      setCardExpanded(!matches);
    };

    applyViewportState(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      applyViewportState(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

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

  // Auto-focus when section opens so arrow keys work without an extra click
  useEffect(() => {
    const justOpened = isSectionOpen && !prevSectionOpenRef.current;
    prevSectionOpenRef.current = isSectionOpen;
    if (justOpened && !isMobile) {
      const id = requestAnimationFrame(() => {
        containerRef.current?.focus();
      });
      return () => cancelAnimationFrame(id);
    }
  }, [isSectionOpen, isMobile]);

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

    if (isMobile) {
      setCardExpanded(false);
    }

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!hasMultipleTools) return;

    const target = event.target as HTMLElement;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goPrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNext();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      setCardExpanded((prev) => !prev);
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!hasMultipleTools) return;

    if (event.touches.length !== 1) {
      swipeStartRef.current = null;
      return;
    }

    const touch = event.touches[0];
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!hasMultipleTools) return;
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
    backgroundColor: 'var(--accent-soft)',
    borderColor: 'var(--accent-muted)',
    color: 'var(--accent)',
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
    <div
      ref={containerRef}
      className="flex flex-col gap-6 max-md:gap-3 outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Tool carousel"
    >
      {/* Desktop: Prev | Card | Next. Mobile: Card on top, then Prev + dots + Next */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        {hasMultipleTools && (
          <button
            type="button"
            onClick={goPrev}
            disabled={!hasPrev || isAnimating}
            className="hidden md:flex shrink-0 w-10 h-10 rounded-xl items-center justify-center border transition-colors theme-hover-opacity theme-accent-interaction disabled:opacity-40 disabled:pointer-events-none"
            style={navButtonStyle}
            aria-label="Previous tool"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2} />
          </button>
        )}
        <div
          className={clsx('flex-1 min-w-0 overflow-hidden max-md:order-first', cardAnimationClass)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'pan-y' }}
        >
          <ToolCard
            tool={current}
            expanded={cardExpanded}
            onExpandToggle={setCardExpanded}
          />
        </div>
        {hasMultipleTools && (
          <div className="flex items-center justify-center gap-2 max-md:justify-between max-md:gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={!hasPrev || isAnimating}
              className="md:hidden shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border transition-colors theme-hover-opacity theme-accent-interaction disabled:opacity-40 disabled:pointer-events-none touch-manipulation"
              style={navButtonStyle}
              aria-label="Previous tool"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2} />
            </button>
            <div className="flex items-center gap-1.5 md:hidden flex-1 justify-center">
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
              className="shrink-0 w-10 h-10 max-md:w-11 max-md:h-11 rounded-xl flex items-center justify-center border transition-colors theme-hover-opacity theme-accent-interaction disabled:opacity-40 disabled:pointer-events-none max-md:touch-manipulation"
              style={navButtonStyle}
              aria-label="Next tool"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        )}
      </div>

      {/* Dots + counter: visible on desktop only (mobile has inline dots above) */}
      <div className={clsx('hidden md:flex items-center justify-center gap-3', !hasMultipleTools && 'md:hidden')}>
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
