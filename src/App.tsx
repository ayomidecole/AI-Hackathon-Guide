import { useState } from 'react';
import { SectionPanel } from './components/SectionPanel';
import { ToolCarousel } from './components/ToolCarousel';
import { sections } from './content/sections';

function App() {
  const [openSectionId, setOpenSectionId] = useState<string | null>('dev-tools');

  const toggleSection = (id: string) => {
    setOpenSectionId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <header className="shrink-0 py-6 px-6 md:px-12 text-center relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold font-mono text-emerald-400 tracking-tight">
          AI Hackathon Guide
        </h1>
        <p className="text-slate-400 text-sm md:text-base mt-2 max-w-2xl mx-auto">
          A curated list of tools and resources to help you build AI applications faster.
        </p>
      </header>

      <main className="flex-1 min-h-0 flex flex-col px-4 md:px-8 pb-6 relative z-10">
        <div className="flex-1 min-h-0 flex flex-col rounded-2xl overflow-hidden overflow-y-auto bg-slate-900/50 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 ring-1 ring-white/5">
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
      </main>

      <footer className="shrink-0 py-3 text-center text-slate-500 text-xs relative z-10">
        Built for builders.
      </footer>
    </div>
  );
}

export default App;
