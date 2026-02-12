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
        'rounded-2xl border bg-white/[0.03] border-white/[0.06] overflow-hidden',
        'transition-colors duration-200 hover:border-white/[0.1] hover:bg-white/[0.04]'
      )}
    >
      <div className="p-5 flex flex-col">
        <div className="flex items-start gap-4">
          {tool.imageUrl ? (
            <img
              src={tool.imageUrl}
              alt=""
              className="w-12 h-12 rounded-xl object-cover bg-white/[0.06] shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-semibold text-lg shrink-0">
              {tool.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-[var(--text-primary)] leading-tight">
              {tool.name}
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">{tool.tagline}</p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={clsx(
            'mt-4 flex items-center justify-between gap-2 w-full py-2 rounded-lg text-sm font-medium transition-colors',
            'text-cyan-400/90 hover:text-cyan-400 hover:bg-cyan-500/5'
          )}
        >
          <span>{isExpanded ? 'Less details' : 'More details'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <div
        className={clsx(
          'border-t border-white/[0.06] overflow-hidden transition-all duration-300 ease-out',
          isExpanded ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="p-5 pt-4 bg-black/20 space-y-4">
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
                  <span className="text-cyan-500/60 mt-0.5 shrink-0">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}

          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium',
              'bg-white/[0.06] border border-white/[0.08] text-[var(--text-primary)]',
              'hover:bg-white/[0.1] hover:border-white/[0.12] transition-colors'
            )}
          >
            Visit website <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </a>
        </div>
      </div>
    </div>
  );
}
