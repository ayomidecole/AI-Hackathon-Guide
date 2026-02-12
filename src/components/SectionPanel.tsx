import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { clsx } from 'clsx';
import type { Section } from '../content/sections';

interface SectionPanelProps {
  section: Section;
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

export function SectionPanel({ section, isOpen, onToggle, children }: SectionPanelProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl border transition-all duration-300 overflow-hidden',
        'bg-white/[0.02] border-white/[0.06]',
        'hover:border-white/[0.08] hover:bg-white/[0.03]',
        isOpen && 'border-white/[0.1] bg-white/[0.04] shadow-lg shadow-black/20'
      )}
    >
      <button
        onClick={onToggle}
        className={clsx(
          'w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]',
          isOpen ? 'bg-white/[0.02]' : ''
        )}
      >
        <div className="min-w-0">
          <h2 className="text-lg md:text-xl font-semibold tracking-tight text-[var(--text-primary)] truncate">
            {section.title}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {section.tools.length} tool{section.tools.length !== 1 ? 's' : ''}
          </p>
        </div>
        <span
          className={clsx(
            'shrink-0 w-9 h-9 rounded-full flex items-center justify-center border transition-colors',
            isOpen
              ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
              : 'bg-white/[0.06] border-white/[0.08] text-[var(--text-muted)]'
          )}
          aria-hidden
        >
          {isOpen ? <Minus className="w-4 h-4" strokeWidth={2} /> : <Plus className="w-4 h-4" strokeWidth={2} />}
        </span>
      </button>

      <div
        className={clsx(
          'overflow-hidden transition-all duration-300 ease-out',
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="p-5 md:p-6 pt-0 border-t border-white/[0.06]">
          {children}
        </div>
      </div>
    </div>
  );
}
