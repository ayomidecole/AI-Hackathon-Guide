import { useState, useEffect } from 'react';
import { SectionPanel } from './components/SectionPanel';
import { ToolCarousel } from './components/ToolCarousel';
import { ChatPanel } from './components/ChatPanel';
import { sections } from './content/sections';
import { Sun, Moon, Linkedin, Github, ChevronLeft, ChevronRight } from 'lucide-react';

const THEME_KEY = 'ai-hackathon-guide-theme';
const MOBILE_MEDIA_QUERY = '(max-width: 849px)';
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
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
    });
    const [chatOpen, setChatOpen] = useState(false);
    const [chatOptions, setChatOptions] = useState<{
        initialInput?: string;
        mode?: 'suggest-stack';
        toolContext?: { toolId: string; toolName: string; toolDescription: string };
    }>({});

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
        const applyViewportState = (matches: boolean) => {
            setIsMobile(matches);
        };

        applyViewportState(mediaQuery.matches);

        const handleChange = (event: MediaQueryListEvent) => {
            applyViewportState(event.matches);
        };

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
        } else {
            mediaQuery.addListener(handleChange);
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handleChange);
            } else {
                mediaQuery.removeListener(handleChange);
            }
        };
    }, []);

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

    const openSuggestStackChat = () => {
        setChatOptions({
            initialInput: "I'm building — suggest a stack",
            mode: 'suggest-stack',
        });
        setChatOpen(true);
    };
    const defaultSectionId = sections[0]?.id ?? null;
    const selectedSectionId = openSectionId ?? defaultSectionId;
    const selectedSectionIndex = sections.findIndex(
        (section) => section.id === selectedSectionId,
    );
    const activeSectionIndex = selectedSectionIndex >= 0 ? selectedSectionIndex : 0;
    const activeSection = sections[activeSectionIndex];

    const goToSection = (index: number) => {
        const section = sections[index];
        if (!section) return;
        setOpenSectionId(section.id);
    };

    const goToPrevSection = () => {
        goToSection(activeSectionIndex - 1);
    };

    const goToNextSection = () => {
        goToSection(activeSectionIndex + 1);
    };

    const contributorsBlock = (
        <>
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
        </>
    );

    if (isMobile) {
        return (
            <div className="relative h-[100dvh] overflow-hidden bg-[var(--bg-base)] text-[var(--text-primary)] font-sans antialiased">
                <div className="glow-bg fixed inset-0 pointer-events-none" aria-hidden />

                <div className="relative z-10 flex h-full flex-col">
                    <header
                        className="shrink-0 border-b px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))]"
                        style={{
                            borderColor: 'var(--border-subtle)',
                            backgroundColor: 'var(--bg-panel)',
                        }}
                    >
                        <div className="flex items-center justify-between gap-2">
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
                        <h1 className="mt-2 font-display text-xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
                            AI Hackathon Guide
                        </h1>
                        <p className="mt-1.5 text-sm text-[var(--text-secondary)] leading-relaxed">
                            A curated list of tools and resources to help you build AI applications faster.
                        </p>
                    </header>

                    <main className="flex-1 overflow-y-auto px-4 pt-4 pb-28">
                        <div className="no-scrollbar -mx-1 mb-3 overflow-x-auto px-1">
                            <div className="flex min-w-max items-center gap-2">
                                {sections.map((section) => {
                                    const isActive = section.id === activeSection?.id;

                                    return (
                                        <button
                                            key={`section-chip-${section.id}`}
                                            type="button"
                                            onClick={() => setOpenSectionId(section.id)}
                                            className="shrink-0 rounded-full border px-3 py-2 text-xs font-medium transition-colors touch-manipulation"
                                            style={{
                                                backgroundColor: isActive
                                                    ? 'var(--accent-soft)'
                                                    : 'var(--bg-card)',
                                                borderColor: isActive
                                                    ? 'var(--accent-muted)'
                                                    : 'var(--border-subtle)',
                                                color: isActive
                                                    ? 'var(--accent)'
                                                    : 'var(--text-secondary)',
                                            }}
                                        >
                                            {section.title}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {activeSection && (
                            <section
                                className="rounded-2xl border overflow-hidden"
                                style={{
                                    borderColor: 'var(--border-subtle)',
                                    backgroundColor: 'var(--bg-card)',
                                }}
                            >
                                <div
                                    className="border-b p-4"
                                    style={{
                                        borderColor: 'var(--border-subtle)',
                                        backgroundColor: 'var(--bg-card-hover)',
                                    }}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-xs text-[var(--text-muted)]">
                                            Section {activeSectionIndex + 1} of {sections.length}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={goToPrevSection}
                                                disabled={activeSectionIndex === 0}
                                                className="w-9 h-9 rounded-lg border flex items-center justify-center transition-colors disabled:opacity-40 disabled:pointer-events-none touch-manipulation"
                                                style={{
                                                    backgroundColor: 'var(--accent-soft)',
                                                    borderColor: 'var(--accent-muted)',
                                                    color: 'var(--accent)',
                                                }}
                                                aria-label="Previous section"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={goToNextSection}
                                                disabled={activeSectionIndex >= sections.length - 1}
                                                className="w-9 h-9 rounded-lg border flex items-center justify-center transition-colors disabled:opacity-40 disabled:pointer-events-none touch-manipulation"
                                                style={{
                                                    backgroundColor: 'var(--accent-soft)',
                                                    borderColor: 'var(--accent-muted)',
                                                    color: 'var(--accent)',
                                                }}
                                                aria-label="Next section"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <h2 className="mt-2 font-display text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                                        {activeSection.title}
                                    </h2>
                                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                                        {activeSection.tools.length} tool
                                        {activeSection.tools.length !== 1 ? 's' : ''}
                                    </p>
                                </div>

                                <div className="p-4">
                                    <ToolCarousel
                                        key={`mobile-carousel-${activeSection.id}`}
                                        tools={activeSection.tools}
                                        isSectionOpen
                                    />
                                </div>
                            </section>
                        )}

                        <div
                            className="mt-8 border-t pb-2 pt-5"
                            style={{ borderColor: 'var(--border-subtle)' }}
                        >
                            {contributorsBlock}
                        </div>
                    </main>
                </div>

                <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
                    <button
                        type="button"
                        onClick={openSuggestStackChat}
                        className="pointer-events-auto w-full rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ease-out suggest-stack-btn"
                        style={{
                            backgroundColor: 'var(--accent-soft)',
                            borderColor: 'var(--accent-muted)',
                            color: 'var(--accent)',
                        }}
                    >
                        Suggest a stack
                    </button>
                </div>

                <ChatPanel
                    isOpen={chatOpen}
                    onClose={() => setChatOpen(false)}
                    initialInput={chatOptions.initialInput}
                    mode={chatOptions.mode}
                    toolContext={chatOptions.toolContext}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-[var(--bg-base)] text-[var(--text-primary)] font-sans antialiased">
            {/* Ambient glow — single smooth gradient, theme-aware */}
            <div
                className="glow-bg fixed inset-0 pointer-events-none"
                aria-hidden
            />

            {/* Terminal window: outer frame + optional title bar, same layout inside */}
            <div
                className="flex-1 flex rounded-2xl border overflow-hidden mx-4 mt-4 mb-4 md:mx-6 md:mt-6 md:mb-6 min-h-0 shadow-2xl"
                style={{
                    borderColor: 'var(--border-muted)',
                    backgroundColor: 'var(--bg-panel)',
                    boxShadow: 'var(--shadow-panel)',
                }}
            >
                <div className="flex-1 flex min-h-0">
                    {/* Left panel — frosted intro */}
                    <aside className="w-[min(360px,max(260px,30vw))] shrink-0 flex flex-col p-4 md:p-6">
                        <div className="flex-1 flex flex-col min-w-0">
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
                            <button
                                type="button"
                                onClick={openSuggestStackChat}
                                className="mt-4 w-full rounded-xl py-2.5 px-4 text-sm font-medium border transition-all duration-200 ease-out suggest-stack-btn"
                                style={{
                                    backgroundColor: 'var(--accent-soft)',
                                    borderColor: 'var(--accent-muted)',
                                    color: 'var(--accent)',
                                }}
                            >
                                Suggest a stack
                            </button>
                            <div
                                className="mt-4 md:mt-5 pt-4 md:pt-5 border-t"
                                style={{ borderColor: 'var(--border-subtle)' }}
                            >
                                {contributorsBlock}
                            </div>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main
                        id="sections"
                        className="flex-1 min-w-0 overflow-auto"
                    >
                        <div className="w-full min-w-0 py-10 md:py-14 px-6 md:px-10">
                            <div className="min-w-0 space-y-4">
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
                        </div>
                    </main>
                </div>
            </div>
            <ChatPanel
                isOpen={chatOpen}
                onClose={() => setChatOpen(false)}
                initialInput={chatOptions.initialInput}
                mode={chatOptions.mode}
                toolContext={chatOptions.toolContext}
            />
        </div>
    );
}

export default App;
