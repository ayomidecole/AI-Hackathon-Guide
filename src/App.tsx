import { useState, useEffect } from 'react';
import { SectionPanel } from './components/SectionPanel';
import { ToolCarousel } from './components/ToolCarousel';
import { sections } from './content/sections';
import { ArrowRight, Sparkles, Sun, Moon } from 'lucide-react';

const THEME_KEY = 'ai-hackathon-guide-theme';
type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function App() {
  const [openSectionId, setOpenSectionId] = useState<string | null>('dev-tools');
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleSection = (id: string) => {
    setOpenSectionId((prev) => (prev === id ? null : id));
  };

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  };

  return (
    <div className="min-h-screen flex max-md:flex-col bg-[var(--bg-base)] text-[var(--text-primary)] font-sans antialiased max-md:overflow-x-hidden">
      {/* Ambient glow — single smooth gradient, theme-aware */}
      <div className="glow-bg fixed inset-0 pointer-events-none" aria-hidden />

      {/* Left panel — frosted intro (sidebar on md+, stacked on small) */}
      <aside className="fixed left-0 top-0 bottom-0 w-[min(320px,26vw)] shrink-0 flex flex-col p-4 md:p-8 z-10 max-md:relative max-md:w-full max-md:bottom-auto max-md:p-3">
        <div
          className="rounded-3xl backdrop-blur-xl flex-1 flex flex-col p-5 md:p-8 shadow-2xl max-md:flex-initial max-md:min-h-0 max-md:py-4 max-md:px-4 max-md:rounded-2xl border transition-colors"
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-subtle)',
            boxShadow: 'var(--shadow-panel)',
          }}
        >
          <div className="flex items-center justify-between gap-2 mb-4 md:mb-6">
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-xs font-medium uppercase tracking-widest">Guide</span>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full p-2 border transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)',
              }}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
            AI Hackathon Guide
          </h1>
          <p className="mt-2 md:mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
            A curated list of tools and resources to help you build AI applications faster.
          </p>
          <div
            className="mt-6 md:mt-8 pt-4 md:pt-6 border-t"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <p className="text-xs text-[var(--text-muted)]">
              {sections.length} categories · Built for builders
            </p>
          </div>
          <div className="mt-auto pt-6 md:pt-8 max-md:mt-3 max-md:pt-4">
            <a
              href="#sections"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors border hover:opacity-90"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-muted)',
              }}
            >
              Browse tools <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main id="sections" className="flex-1 min-w-0 md:pl-[min(320px,26vw)] relative z-0 max-md:overflow-x-hidden">
        <div className="w-full py-10 md:py-14 px-6 md:px-10 max-md:py-5 max-md:px-4">
          <div className="text-right text-xs text-[var(--text-muted)] mb-2 max-md:mb-1.5">
            Work highlights
          </div>
          <div className="space-y-4 max-md:space-y-3">
            {sections.map((section) => (
              <SectionPanel
                key={section.id}
                section={section}
                isOpen={openSectionId === section.id}
                onToggle={() => toggleSection(section.id)}
              >
                <ToolCarousel tools={section.tools} />
              </SectionPanel>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
