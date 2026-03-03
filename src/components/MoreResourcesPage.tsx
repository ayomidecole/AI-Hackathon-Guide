import {
    type CSSProperties,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    moreResources,
    type ResourceLink,
} from '../content/moreResources';

const MOBILE_QUERY = '(max-width: 849px)';
const RESOURCE_HINT_ATTR = 'data-more-resources-hint';
const PRECONNECT_ORIGINS = [
    'https://www.youtube-nocookie.com',
    'https://www.youtube.com',
];

function addHeadLink(
    rel: string,
    href: string,
    options?: { as?: string; crossOrigin?: string },
) {
    const selector = `link[rel="${rel}"][href="${href}"]`;
    if (document.head.querySelector(selector)) return;

    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (options?.as) link.as = options.as;
    if (options?.crossOrigin) link.crossOrigin = options.crossOrigin;
    link.setAttribute(RESOURCE_HINT_ATTR, 'true');
    document.head.appendChild(link);
}

function getInitialMobileState(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(MOBILE_QUERY).matches;
}

export function MoreResourcesPage() {
    const [isMobile, setIsMobile] = useState(getInitialMobileState);
    const [hoveredResourceId, setHoveredResourceId] = useState<string | null>(
        null,
    );
    const [previewAnchor, setPreviewAnchor] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const [previewLinkRect, setPreviewLinkRect] = useState<{
        left: number;
        right: number;
        top: number;
        bottom: number;
    } | null>(null);
    const [loadedEmbedUrl, setLoadedEmbedUrl] = useState<string | null>(null);
    const hidePreviewTimeoutRef = useRef<number | null>(null);
    const hoveredResource = useMemo(
        () =>
            moreResources.find(
                (resource) => resource.id === hoveredResourceId,
            ) ?? null,
        [hoveredResourceId],
    );
    const videoResources = useMemo(
        () => moreResources.filter((resource) => resource.type === 'video'),
        [],
    );
    const articleResources = useMemo(
        () => moreResources.filter((resource) => resource.type === 'article'),
        [],
    );
    const activeEmbedUrl = hoveredResource?.embedUrl;
    const isPreviewLoading =
        Boolean(activeEmbedUrl) && loadedEmbedUrl !== activeEmbedUrl;
    const floatingModalStyle = useMemo<CSSProperties | undefined>(() => {
        if (typeof window === 'undefined' || isMobile) {
            return undefined;
        }
        const hasLinkRect = previewLinkRect != null;
        const hasAnchor = previewAnchor != null;
        if (!hasLinkRect && !hasAnchor) {
            return undefined;
        }

        const margin = 16;
        const gapFromLink = 16;
        const width = Math.max(
            360,
            Math.min(520, Math.round(window.innerWidth * 0.34)),
        );
        const estimatedHeight = Math.round(width * (9 / 16) + 82);

        let left: number;
        let top: number;

        if (hasLinkRect) {
            left = previewLinkRect.right + gapFromLink;
            top =
                previewLinkRect.top +
                (previewLinkRect.bottom - previewLinkRect.top) / 2 -
                estimatedHeight / 2;
            left = Math.max(
                margin,
                Math.min(window.innerWidth - width - margin, left),
            );
            top = Math.max(
                margin,
                Math.min(window.innerHeight - estimatedHeight - margin, top),
            );
            const modalRight = left + width;
            const modalBottom = top + estimatedHeight;
            const overlapsLink =
                left < previewLinkRect.right &&
                modalRight > previewLinkRect.left &&
                top < previewLinkRect.bottom &&
                modalBottom > previewLinkRect.top;
            if (overlapsLink) {
                const aboveTop =
                    previewLinkRect.top - estimatedHeight - gapFromLink;
                if (aboveTop >= margin) {
                    top = aboveTop;
                } else {
                    top = Math.min(
                        previewLinkRect.bottom + gapFromLink,
                        window.innerHeight - estimatedHeight - margin,
                    );
                }
            }
        } else if (hasAnchor) {
            left = Math.max(
                margin,
                Math.min(
                    window.innerWidth - width - margin,
                    previewAnchor.x + 32,
                ),
            );
            top = Math.max(
                margin,
                Math.min(
                    window.innerHeight - estimatedHeight - margin,
                    previewAnchor.y - Math.round(estimatedHeight * 0.24),
                ),
            );
        } else {
            return undefined;
        }

        return {
            left: `${left}px`,
            top: `${top}px`,
            width: `${width}px`,
        };
    }, [isMobile, previewAnchor, previewLinkRect]);

    useEffect(() => {
        if (typeof document === 'undefined') return;
        for (const origin of PRECONNECT_ORIGINS) {
            addHeadLink('preconnect', origin, { crossOrigin: 'anonymous' });
            addHeadLink('dns-prefetch', origin);
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mediaQuery = window.matchMedia(MOBILE_QUERY);
        const handleChange = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    useEffect(() => {
        return () => {
            if (hidePreviewTimeoutRef.current !== null) {
                window.clearTimeout(hidePreviewTimeoutRef.current);
            }
        };
    }, []);

    const warmPreview = useCallback((resource: ResourceLink) => {
        if (!resource.embedUrl || typeof document === 'undefined') return;
        addHeadLink('prefetch', resource.embedUrl, { as: 'document' });
    }, []);

    const clearHidePreviewTimeout = useCallback(() => {
        if (hidePreviewTimeoutRef.current !== null) {
            window.clearTimeout(hidePreviewTimeoutRef.current);
            hidePreviewTimeoutRef.current = null;
        }
    }, []);

    const showPreview = useCallback(
        (
            resource: ResourceLink,
            anchor?: { x: number; y: number },
            linkRect?: DOMRect,
        ) => {
            clearHidePreviewTimeout();
            warmPreview(resource);
            setHoveredResourceId(resource.id);
            if (anchor) {
                setPreviewAnchor(anchor);
            }
            if (linkRect) {
                setPreviewLinkRect({
                    left: linkRect.left,
                    right: linkRect.right,
                    top: linkRect.top,
                    bottom: linkRect.bottom,
                });
            }
        },
        [clearHidePreviewTimeout, warmPreview],
    );

    const movePreviewAnchor = useCallback((anchor: { x: number; y: number }) => {
        setPreviewAnchor(anchor);
    }, []);

    const scheduleHidePreview = useCallback(() => {
        clearHidePreviewTimeout();
        hidePreviewTimeoutRef.current = window.setTimeout(() => {
            setHoveredResourceId(null);
            setPreviewAnchor(null);
            setPreviewLinkRect(null);
            setLoadedEmbedUrl(null);
            hidePreviewTimeoutRef.current = null;
        }, 120);
    }, [clearHidePreviewTimeout]);

    const renderResourceList = (resources: ResourceLink[]) => (
        <ul className="more-resources-list">
            {resources.map((resource) => {
                return (
                    <li key={resource.id}>
                        <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="more-resources-link"
                            onMouseEnter={(event) => {
                                const rect =
                                    event.currentTarget.getBoundingClientRect();
                                showPreview(
                                    resource,
                                    {
                                        x: event.clientX,
                                        y: event.clientY,
                                    },
                                    rect,
                                );
                            }}
                            onMouseMove={(event) =>
                                movePreviewAnchor({
                                    x: event.clientX,
                                    y: event.clientY,
                                })
                            }
                            onMouseLeave={scheduleHidePreview}
                            onFocus={(event) => {
                                const rect =
                                    event.currentTarget.getBoundingClientRect();
                                showPreview(
                                    resource,
                                    {
                                        x: rect.right,
                                        y: rect.top + rect.height / 2,
                                    },
                                    rect,
                                );
                            }}
                            onBlur={scheduleHidePreview}
                            onMouseDown={() => warmPreview(resource)}
                        >
                            {resource.label}
                        </a>
                    </li>
                );
            })}
        </ul>
    );

    return (
        <section className="space-y-5 md:space-y-7">
            <header className="space-y-3">
                <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                    More resources
                </h2>
            </header>

            <div className="more-resources-list-shell">
                <div className="space-y-6 py-1">
                    {videoResources.length > 0 && (
                        <section className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                                Videos
                            </h3>
                            {renderResourceList(videoResources)}
                        </section>
                    )}
                    {articleResources.length > 0 && (
                        <section className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                                Articles
                            </h3>
                            {renderResourceList(articleResources)}
                        </section>
                    )}
                </div>

                {!isMobile && hoveredResource && (
                    <aside
                        className="resource-hover-floating"
                        aria-label={`Preview ${hoveredResource.label}`}
                        onMouseEnter={clearHidePreviewTimeout}
                        onMouseLeave={scheduleHidePreview}
                        style={floatingModalStyle}
                    >
                        <div className="resource-hover-floating-header">
                            <p className="text-xs uppercase tracking-wider font-medium text-[var(--text-muted)]">
                                Preview
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[var(--text-primary)] truncate">
                                {hoveredResource.label}
                            </p>
                        </div>
                        <div className="resource-hover-floating-frame">
                            {activeEmbedUrl ? (
                                <>
                                    {isPreviewLoading && (
                                        <div className="resource-preview-loading absolute inset-0 z-10 flex items-center justify-center text-sm text-[var(--text-secondary)]">
                                            Loading preview...
                                        </div>
                                    )}
                                    <iframe
                                        key={activeEmbedUrl}
                                        src={activeEmbedUrl}
                                        title={`Preview ${hoveredResource.label}`}
                                        className={`resource-preview-iframe w-full h-full ${isPreviewLoading ? '' : 'is-loaded'}`}
                                        loading="lazy"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        onLoad={(event) =>
                                            setLoadedEmbedUrl(
                                                event.currentTarget.src,
                                            )
                                        }
                                        onError={() =>
                                            setLoadedEmbedUrl(activeEmbedUrl)
                                        }
                                    />
                                </>
                            ) : (
                                <div className="resource-preview-empty absolute inset-0 flex items-center justify-center text-sm text-[var(--text-secondary)]">
                                    Preview unavailable for this resource.
                                </div>
                            )}
                        </div>
                    </aside>
                )}
            </div>
        </section>
    );
}
