export type ResourceType = 'video' | 'article';

export interface ResourceLink {
    id: string;
    type: ResourceType;
    label: string;
    url: string;
    embedUrl?: string;
}

function parseTimeToSeconds(value: string): number | null {
    const trimmed = value.trim();
    if (!trimmed) return null;

    if (/^\d+$/.test(trimmed)) {
        return Number.parseInt(trimmed, 10);
    }

    const match = trimmed.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i);
    if (!match) return null;

    const hours = match[1] ? Number.parseInt(match[1], 10) : 0;
    const minutes = match[2] ? Number.parseInt(match[2], 10) : 0;
    const seconds = match[3] ? Number.parseInt(match[3], 10) : 0;
    const total = hours * 3600 + minutes * 60 + seconds;
    return total > 0 ? total : null;
}

export function getYouTubeEmbedUrl(url: string): string | undefined {
    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        return undefined;
    }

    const host = parsed.hostname.replace(/^www\./, '');
    let videoId: string | null = null;

    if (host === 'youtu.be') {
        videoId = parsed.pathname.slice(1) || null;
    } else if (host === 'youtube.com' || host === 'm.youtube.com') {
        if (parsed.pathname === '/watch') {
            videoId = parsed.searchParams.get('v');
        } else if (parsed.pathname.startsWith('/shorts/')) {
            videoId = parsed.pathname.split('/')[2] || null;
        } else if (parsed.pathname.startsWith('/embed/')) {
            videoId = parsed.pathname.split('/')[2] || null;
        }
    }

    if (!videoId) return undefined;

    const embedUrl = new URL(
        `https://www.youtube-nocookie.com/embed/${videoId}`,
    );
    const startParam =
        parsed.searchParams.get('t') ?? parsed.searchParams.get('start');
    const startSeconds = startParam ? parseTimeToSeconds(startParam) : null;
    if (startSeconds) {
        embedUrl.searchParams.set('start', String(startSeconds));
    }

    return embedUrl.toString();
}

const baseResourceLinks: Omit<ResourceLink, 'embedUrl'>[] = [
    {
        id: 'cursor-visual-editor',
        type: 'video',
        label: 'Cursor visual editor',
        url: 'https://www.youtube.com/watch?v=XOtHjA8THCw',
    },
    {
        id: 'claude-agent-tips-explained',
        type: 'video',
        label: 'Claude agent tips explained',
        url: 'https://www.youtube.com/watch?v=fOxC44g8vig&t=53s',
    },
    {
        id: 'rkxotiem5qq',
        type: 'video',
        label: '10 Tips for Building on Replit',
        url: 'https://www.youtube.com/watch?v=RkXotIEM5QQ',
    },
    {
        id: 'rqvtLxwMklo',
        type: 'video',
        label: 'Master Lovable In 24 Minutes',
        url: 'https://www.youtube.com/watch?v=rqvtLxwMklo',
    },
    {
        id: 'Be5IAxyxa6g',
        type: 'video',
        label: 'Beautiful apps in 3 prompts (Cursor 2.0)',
        url: 'https://www.youtube.com/watch?v=Be5IAxyxa6g&t=1346s',
    },
    {
        id: 'systematicls-article',
        type: 'article',
        label: 'Systematic LS article (X)',
        url: 'https://x.com/systematicls/status/2028814227004395561?s=46',
    },
];

export const moreResources: ResourceLink[] = baseResourceLinks.map(
    (resource) => ({
        ...resource,
        embedUrl: getYouTubeEmbedUrl(resource.url),
    }),
);
