import { useState, useEffect } from 'react';
import { SectionPanel } from './components/SectionPanel';
import { ToolCarousel } from './components/ToolCarousel';
import { sections } from './content/sections';
import { Sun, Moon, Linkedin, Github } from 'lucide-react';

const THEME_KEY = 'ai-hackathon-guide-theme';
type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark';
}

function App() {
    const [openSectionId, setOpenSectionId] = useState<string | null>(
        'dev-tools',
    );
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
            <div
                className="glow-bg fixed inset-0 pointer-events-none"
                aria-hidden
            />

            {/* Terminal window: outer frame + optional title bar, same layout inside */}
            <div
                className="flex-1 flex max-md:flex-col rounded-2xl border overflow-hidden mx-4 mt-4 mb-4 md:mx-6 md:mt-6 md:mb-6 min-h-0 shadow-2xl max-md:mx-3 max-md:mt-3 max-md:mb-3"
                style={{
                    borderColor: 'var(--border-muted)',
                    backgroundColor: 'var(--bg-panel)',
                    boxShadow: 'var(--shadow-panel)',
                }}
            >
                <div className="flex-1 flex max-md:flex-col min-h-0">
                    {/* Left panel — frosted intro (sidebar on md+, stacked on small) */}
                    <aside className="w-[min(360px,max(260px,30vw))] shrink-0 flex flex-col p-4 md:p-6 max-md:w-full max-md:p-4">
                        <div className="flex-1 flex flex-col min-w-0 max-md:min-h-0">
                            <div className="flex items-center justify-between gap-2 mb-4 md:mb-6">
                                <span className="text-[var(--text-muted)] text-xs font-medium uppercase tracking-widest">
                                    Guide
                                </span>
                                <button
                                    type="button"
                                    onClick={toggleTheme}
                                    className="rounded-full p-2 border transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
                                    style={{
                                        backgroundColor: 'var(--bg-card)',
                                        borderColor: 'var(--border-subtle)',
                                        color: 'var(--text-secondary)',
                                    }}
                                    aria-label={
                                        theme === 'dark'
                                            ? 'Switch to light mode'
                                            : 'Switch to dark mode'
                                    }
                                >
                                    {theme === 'dark' ? (
                                        <Sun className="w-4 h-4" />
                                    ) : (
                                        <Moon className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            <h1 className="font-display text-xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)] leading-tight min-w-0 break-words">
                                AI Hackathon Guide
                            </h1>
                            <p className="mt-2 md:mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                                A curated list of tools and resources to help
                                you build AI applications faster.
                            </p>
                            <div
                                className="mt-4 md:mt-5 pt-4 md:pt-5 border-t max-md:hidden"
                                style={{ borderColor: 'var(--border-subtle)' }}
                            >
                                <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                                    Contributors
                                </p>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-semibold flex items-center gap-2 flex-wrap">
                                    Created by Ayomide Aremu-Cole
                                    <span className="inline-flex items-center gap-1.5">
                                        <a
                                            href="https://www.linkedin.com/in/ayomidecole98/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1 rounded transition-colors hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                                            aria-label="Ayomide Aremu-Cole on LinkedIn"
                                        >
                                            <Linkedin className="w-4 h-4" />
                                        </a>
                                        <a
                                            href="https://github.com/ayomidecole"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1 rounded transition-colors hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                                            aria-label="Ayomide Aremu-Cole on GitHub"
                                        >
                                            <Github className="w-4 h-4" />
                                        </a>
                                    </span>
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main
                        id="sections"
                        className="flex-1 min-w-0 overflow-auto max-md:overflow-x-hidden"
                    >
                        <div className="w-full py-10 md:py-14 px-6 md:px-10 max-md:py-5 max-md:px-4">
                            <div className="space-y-4 max-md:space-y-3">
                                {sections.map((section) => {
                                    const contributors =
                                        section.contributors ?? [];
                                    const hasTools = section.tools.length > 0;
                                    const showContributors =
                                        !hasTools && contributors.length > 0;

                                    return (
                                        <SectionPanel
                                            key={section.id}
                                            section={section}
                                            isOpen={
                                                openSectionId === section.id
                                            }
                                            onToggle={() =>
                                                toggleSection(section.id)
                                            }
                                        >
                                            {showContributors ? null : (
                                                <ToolCarousel
                                                    tools={section.tools}
                                                    isSectionOpen={
                                                        openSectionId ===
                                                        section.id
                                                    }
                                                />
                                            )}
                                        </SectionPanel>
                                    );
                                })}
                            </div>
                            {/* Contributors at bottom on mobile so a long list doesn't push main content down */}
                            <div
                                className="mt-8 pt-5 border-t md:hidden pb-2"
                                style={{ borderColor: 'var(--border-subtle)' }}
                            >
                                <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                                    Contributors
                                </p>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-semibold flex items-center gap-2 flex-wrap">
                                    Created by Ayomide Aremu-Cole
                                    <span className="inline-flex items-center gap-1.5">
                                        <a
                                            href="https://www.linkedin.com/in/ayomidecole98/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1 rounded transition-colors hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                                            aria-label="Ayomide Aremu-Cole on LinkedIn"
                                        >
                                            <Linkedin className="w-4 h-4" />
                                        </a>
                                        <a
                                            href="https://github.com/ayomidecole"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1 rounded transition-colors hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                                            aria-label="Ayomide Aremu-Cole on GitHub"
                                        >
                                            <Github className="w-4 h-4" />
                                        </a>
                                    </span>
                                </p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default App;
