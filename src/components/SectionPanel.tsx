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
        'border transition-all duration-300 overflow-hidden',
        'hover:opacity-[0.98]',
        isOpen && 'shadow-lg'
      )}
      style={{
        backgroundColor: isOpen ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        borderColor: isOpen ? 'var(--border-muted)' : 'var(--border-subtle)',
        boxShadow: isOpen ? 'var(--shadow-panel)' : undefined,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 md:p-6 max-md:p-4 max-md:gap-3 max-md:touch-manipulation text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
      >
        <div className="min-w-0 flex-1">
          <h2 className="text-lg md:text-xl font-semibold tracking-tight text-[var(--text-primary)] truncate max-md:text-base">
            {section.title}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {section.tools.length} tool{section.tools.length !== 1 ? 's' : ''}
          </p>
        </div>
        <span
          className={clsx(
            'shrink-0 w-9 h-9 rounded-full flex items-center justify-center border transition-colors',
            isOpen && 'border-[var(--accent)] text-[var(--accent)]'
          )}
          style={{
            backgroundColor: isOpen ? 'var(--accent-soft)' : 'var(--bg-card)',
            borderColor: isOpen ? 'var(--accent-muted)' : 'var(--border-muted)',
            color: isOpen ? undefined : 'var(--text-muted)',
          }}
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
        <div
          className="p-5 md:p-6 pt-0 border-t max-md:p-4 max-md:pt-0"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
