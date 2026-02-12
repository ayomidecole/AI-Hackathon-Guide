import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
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
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={onToggle}
        className={clsx(
          "w-full flex items-center justify-between p-6 text-left transition-colors duration-200",
          "hover:bg-white/5 focus:outline-none focus:bg-white/5",
          isOpen ? "bg-white/5" : ""
        )}
      >
        <h2 className="text-2xl font-mono font-bold text-emerald-400">
          {section.title}
        </h2>
        {isOpen ? (
          <ChevronDown className="w-6 h-6 text-emerald-400" />
        ) : (
          <ChevronRight className="w-6 h-6 text-gray-400" />
        )}
      </button>
      
      <div
        className={clsx(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-6 pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
