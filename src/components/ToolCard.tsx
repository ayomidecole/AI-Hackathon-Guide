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
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-colors duration-300">
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {tool.imageUrl ? (
              <img src={tool.imageUrl} alt={tool.name} className="w-10 h-10 rounded-lg object-cover bg-white/10" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg">
                {tool.name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-bold text-lg text-white leading-tight">{tool.name}</h3>
              <p className="text-xs text-slate-400 font-mono">{tool.tagline}</p>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-xs text-emerald-400 hover:text-emerald-300 transition-colors py-2"
          >
            <span>{isExpanded ? 'Less details' : 'More details'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div
        className={clsx(
          "bg-black/20 overflow-hidden transition-all duration-300 ease-in-out border-t border-white/5",
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-4 space-y-3">
          <p className="text-sm text-slate-300 leading-relaxed">
            {tool.description}
          </p>
          
          {tool.bullets.length > 0 && (
            <ul className="space-y-1">
              {tool.bullets.map((bullet, idx) => (
                <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                  <span className="text-emerald-500/50 mt-1">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="pt-2">
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Visit Website <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
