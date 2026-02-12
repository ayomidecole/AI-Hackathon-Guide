import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';
import type { Tool } from '../content/sections';

interface ToolCardProps {
    tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className={clsx(
                'rounded-2xl border overflow-hidden transition-colors duration-200 hover:opacity-[0.98]',
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
                    className="mt-4 max-md:mt-3 flex items-center justify-between gap-2 w-full py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90 max-md:text-xs max-md:touch-manipulation"
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
                        ? 'max-h-[1200px] opacity-100'
                        : 'max-h-0 opacity-0',
                )}
                style={{ borderColor: 'var(--border-subtle)' }}
            >
                <div
                    className="p-5 pt-4 space-y-4 max-md:p-4 max-md:pt-3 max-md:space-y-3"
                    style={{ backgroundColor: 'var(--bg-card-hover)' }}
                >
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {tool.description}
                    </p>

                    {tool.bullets.length > 0 && (
                        <ul className="space-y-2">
                            {tool.bullets.map((bullet, idx) => (
                                <li
                                    key={idx}
                                    className="text-sm text-[var(--text-secondary)] flex items-start gap-2"
                                >
                                    <span
                                        className="mt-0.5 shrink-0"
                                        style={{ color: 'var(--accent)' }}
                                    >
                                        •
                                    </span>
                                    <span>{bullet}</span>
                                </li>
                            ))}
                        </ul>
                    )}

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
                                src={tool.url}
                                title={`${tool.name} homepage`}
                                loading="lazy"
                                className="block w-full h-56 md:h-72"
                                referrerPolicy="strict-origin-when-cross-origin"
                            />
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">
                            If the preview is blocked, open the website in a
                            new tab.
                        </p>
                    </div>

                    <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors border hover:opacity-90"
                        style={{
                            backgroundColor: 'var(--bg-card)',
                            borderColor: 'var(--border-muted)',
                            color: 'var(--text-primary)',
                        }}
                    >
                        Visit website{' '}
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>
                </div>
            </div>
        </div>
    );
}
