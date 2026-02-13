import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { clsx } from 'clsx';
import type { Section } from '../content/sections';

const HOVER_GLOW =
    '0 0 36px var(--glow-primary), 0 0 12px var(--glow-secondary)';

interface SectionPanelProps {
    section: Section;
    isOpen: boolean;
    onToggle: () => void;
    children?: React.ReactNode;
}

export function SectionPanel({
    section,
    isOpen,
    onToggle,
    children,
}: SectionPanelProps) {
    const [isHovered, setIsHovered] = useState(false);
    const hasTools = section.tools.length > 0;
    const contributors = section.contributors ?? [];
    const showContributors = !hasTools && contributors.length > 0;
    const itemCount = showContributors
        ? contributors.length
        : section.tools.length;
    const itemLabel = showContributors ? 'contributor' : 'tool';

    const hideHeader = showContributors;

    const showPanelShadow = !hideHeader && isOpen;
    const boxShadow =
        showPanelShadow && isHovered
            ? `var(--shadow-panel), ${HOVER_GLOW}`
            : showPanelShadow
              ? 'var(--shadow-panel)'
              : isHovered
                ? HOVER_GLOW
                : undefined;

    const handlePointerEnter = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        if (event.pointerType === 'mouse') {
            setIsHovered(true);
        }
    };

    const handlePointerLeave = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        if (event.pointerType === 'mouse') {
            setIsHovered(false);
        }
    };

    const handlePointerDown = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        if (event.pointerType !== 'mouse') {
            setIsHovered(true);
        }
    };

    const clearTouchHover = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== 'mouse') {
            setIsHovered(false);
        }
    };

    return (
        <div
            className={clsx(
                'border transition-all duration-[350ms] overflow-hidden ease-out',
                !hideHeader && isOpen && 'shadow-lg',
            )}
            style={{
                backgroundColor: hideHeader
                    ? 'var(--bg-card)'
                    : isOpen
                      ? 'var(--bg-card-hover)'
                      : 'var(--bg-card)',
                borderColor: hideHeader
                    ? 'var(--border-subtle)'
                    : isHovered
                      ? 'var(--border-muted)'
                      : isOpen
                        ? 'var(--border-muted)'
                        : 'var(--border-subtle)',
                boxShadow,
                transform: isHovered
                    ? 'translate3d(0, -0.25rem, 0) scale(1.008)'
                    : undefined,
            }}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onPointerDown={handlePointerDown}
            onPointerUp={clearTouchHover}
            onPointerCancel={clearTouchHover}
        >
            {!hideHeader && (
                <button
                    onClick={onToggle}
                    className="w-full flex items-center justify-between gap-4 p-5 md:p-6 max-md:p-4 max-md:gap-3 max-md:touch-manipulation text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
                >
                    <div className="min-w-0 flex-1">
                        <h2 className="font-display text-lg md:text-xl font-semibold tracking-tight text-[var(--text-primary)] truncate max-md:text-base flex items-center gap-2">
                            <span className="font-mono text-sm text-[var(--text-muted)] shrink-0">
                                &gt;
                            </span>
                            {section.title}
                        </h2>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                            {itemCount} {itemLabel}
                            {itemCount !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <span
                        className={clsx(
                            'shrink-0 w-9 h-9 rounded-full flex items-center justify-center border transition-colors',
                            isOpen &&
                                'border-[var(--accent)] text-[var(--accent)]',
                        )}
                        style={{
                            backgroundColor: isOpen
                                ? 'var(--accent-soft)'
                                : 'var(--bg-card)',
                            borderColor: isOpen
                                ? 'var(--accent-muted)'
                                : 'var(--border-muted)',
                            color: isOpen ? undefined : 'var(--text-muted)',
                        }}
                        aria-hidden
                    >
                        {isOpen ? (
                            <Minus className="w-4 h-4" strokeWidth={2} />
                        ) : (
                            <Plus className="w-4 h-4" strokeWidth={2} />
                        )}
                    </span>
                </button>
            )}

            <div
                className={clsx(
                    'overflow-hidden transition-all duration-300 ease-out',
                    hideHeader
                        ? 'max-h-[2000px] opacity-100'
                        : isOpen
                          ? 'max-h-[2000px] opacity-100'
                          : 'max-h-0 opacity-0',
                )}
            >
                <div
                    className="p-5 md:p-6 pt-0 border-t max-md:p-4 max-md:pt-0 max-md:pt-4"
                    style={{ borderColor: 'var(--border-subtle)' }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
