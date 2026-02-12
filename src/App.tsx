import { useState } from 'react';
import { SectionPanel } from './components/SectionPanel';
import { ToolCarousel } from './components/ToolCarousel';
import { sections } from './content/sections';
import { ArrowRight, Sparkles } from 'lucide-react';

function App() {
  const [openSectionId, setOpenSectionId] = useState<string | null>('dev-tools');

  const toggleSection = (id: string) => {
    setOpenSectionId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen flex max-md:flex-col bg-[var(--bg-base)] text-[var(--text-primary)] font-sans antialiased">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[50vmax] h-[50vmax] rounded-full bg-cyan-500/[0.04] blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[40vmax] h-[40vmax] rounded-full bg-slate-500/[0.03] blur-[120px]" />
      </div>

      {/* Left panel — frosted intro (sidebar on md+, stacked on small) */}
      <aside className="fixed left-0 top-0 bottom-0 w-[min(320px,26vw)] shrink-0 flex flex-col p-4 md:p-8 z-10 max-md:relative max-md:w-full max-md:bottom-auto max-md:p-4">
        <div className="rounded-3xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl flex-1 flex flex-col p-5 md:p-8 shadow-2xl max-md:flex-initial max-md:min-h-0">
          <div className="flex items-center gap-2 text-[var(--text-muted)] mb-4 md:mb-6">
            <Sparkles className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-xs font-medium uppercase tracking-widest">Guide</span>
          </div>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
            AI Hackathon Guide
          </h1>
          <p className="mt-2 md:mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
            A curated list of tools and resources to help you build AI applications faster.
          </p>
          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/[0.06]">
            <p className="text-xs text-[var(--text-muted)]">
              {sections.length} categories · Built for builders
            </p>
          </div>
          <div className="mt-auto pt-6 md:pt-8 max-md:mt-4">
            <a
              href="#sections"
              className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.08] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors"
            >
              Browse tools <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main id="sections" className="flex-1 min-w-0 md:pl-[min(320px,26vw)] relative z-0">
        <div className="max-w-4xl mx-auto py-10 md:py-14 px-6 md:px-10">
          <div className="text-right text-xs text-[var(--text-muted)] mb-2">
            Work highlights
          </div>
          <div className="space-y-4">
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
