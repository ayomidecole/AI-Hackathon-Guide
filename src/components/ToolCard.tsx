import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';
import type { Tool } from '../content/sections';

interface ToolCardProps {
    tool: Tool;
    /** When provided, card expand/collapse is controlled by the parent (e.g. for keyboard). */
    expanded?: boolean;
    onExpandToggle?: (expanded: boolean) => void;
}

export function ToolCard({
    tool,
    expanded: controlledExpanded,
    onExpandToggle,
}: ToolCardProps) {
    const [internalExpanded, setInternalExpanded] = useState(true);
    const isControlled =
        controlledExpanded !== undefined && onExpandToggle !== undefined;
    const isExpanded = isControlled ? controlledExpanded : internalExpanded;
    const setIsExpanded = isControlled
        ? (next: boolean) => onExpandToggle(next)
        : setInternalExpanded;

    return (
        <div
            className={clsx(
                'rounded-2xl border overflow-hidden transition-colors duration-200 theme-hover-opacity',
            )}
            style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
            }}
        >
            <div className="p-5 max-md:p-4 flex flex-col">
                <div className="flex items-start gap-4 max-md:gap-3">
                    {tool.imageUrl ? (
                        <img
                            src={tool.imageUrl}
                            alt=""
                            className="w-12 h-12 max-md:w-10 max-md:h-10 rounded-xl max-md:rounded-lg object-cover shrink-0"
                            style={{ backgroundColor: 'var(--bg-card-hover)' }}
                        />
                    ) : (
                        <div
                            className="w-12 h-12 max-md:w-10 max-md:h-10 rounded-xl max-md:rounded-lg flex items-center justify-center font-semibold text-lg max-md:text-base shrink-0 border"
                            style={{
                                backgroundColor: 'var(--accent-soft)',
                                borderColor: 'var(--accent-muted)',
                                color: 'var(--accent)',
                            }}
                        >
                            {tool.name.charAt(0)}
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <h3 className="font-display font-semibold text-[var(--text-primary)] leading-tight max-md:text-sm">
                            {tool.name}
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] mt-0.5 max-md:text-xs max-md:truncate">
                            {tool.tagline}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 max-md:mt-3 flex items-center justify-between gap-2 w-full py-2 rounded-lg text-sm font-medium transition-colors max-md:text-xs max-md:touch-manipulation"
                    style={{ color: 'var(--accent)' }}
                >
                    <span>{isExpanded ? 'Less details' : 'More details'}</span>
                    {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                    ) : (
                        <ChevronDown className="w-4 h-4" />
                    )}
                </button>
            </div>

            <div
                className={clsx(
                    'border-t overflow-hidden transition-all duration-300 ease-out',
                    isExpanded
                        ? tool.detailsSections?.length || tool.detailsVideo
                            ? 'max-h-[80vh]'
                            : 'max-h-[420px]'
                        : 'max-h-0',
                )}
                style={{
                    borderColor: 'var(--border-subtle)',
                    opacity: isExpanded ? 1 : 'var(--content-collapse-opacity)',
                }}
            >
                <div
                    className="p-5 pt-4 space-y-4 max-md:p-4 max-md:pt-3 overflow-y-auto max-h-[78vh]"
                    style={{ backgroundColor: 'var(--bg-card-hover)' }}
                >
                    {tool.detailsGuide && (
                        <a
                            href={tool.detailsGuide.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors border theme-hover-opacity theme-accent-interaction w-fit"
                            style={{
                                backgroundColor: 'var(--accent-soft)',
                                borderColor: 'var(--accent-muted)',
                                color: 'var(--accent)',
                            }}
                        >
                            Read: {tool.detailsGuide.label}
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    )}

                    {tool.detailsVideo && (
                        <div
                            className="rounded-xl border p-3 space-y-2"
                            style={{ borderColor: 'var(--border-subtle)' }}
                        >
                            <p
                                className="text-sm font-medium"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                {tool.detailsVideo.title}
                            </p>
                            <div
                                className="w-full overflow-hidden rounded-lg border aspect-video"
                                style={{
                                    borderColor: 'var(--border-subtle)',
                                }}
                            >
                                <iframe
                                    src={tool.detailsVideo.embedUrl}
                                    title={tool.detailsVideo.title}
                                    loading="lazy"
                                    className="w-full h-full"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            </div>
                            {tool.detailsVideo.watchUrl && (
                                <a
                                    href={tool.detailsVideo.watchUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-medium theme-hover-opacity"
                                    style={{ color: 'var(--accent)' }}
                                >
                                    Open on YouTube
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                    )}

                    {tool.detailsSections?.map((section, idx) => (
                        <div key={idx} className="space-y-2">
                            <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                                {section.heading}
                            </h4>
                            <ul className="space-y-1.5">
                                {section.items.map((item, i) => (
                                    <li
                                        key={i}
                                        className="text-sm text-[var(--text-secondary)] flex items-start gap-2 leading-snug"
                                    >
                                        <span
                                            className="mt-1 shrink-0"
                                            style={{ color: 'var(--accent)' }}
                                        >
                                            •
                                        </span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
