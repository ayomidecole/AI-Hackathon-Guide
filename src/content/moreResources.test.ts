import { describe, it, expect } from 'vitest';
import { getYouTubeEmbedUrl, moreResources } from './moreResources';

describe('moreResources', () => {
    describe('getYouTubeEmbedUrl', () => {
        it('returns undefined for invalid URL', () => {
            expect(getYouTubeEmbedUrl('not-a-url')).toBeUndefined();
            expect(getYouTubeEmbedUrl('')).toBeUndefined();
        });

        it('extracts video id from youtu.be short links', () => {
            const result = getYouTubeEmbedUrl('https://youtu.be/abc123');
            expect(result).toBe(
                'https://www.youtube-nocookie.com/embed/abc123',
            );
        });

        it('extracts video id from www.youtu.be', () => {
            const result = getYouTubeEmbedUrl('https://www.youtu.be/xyz789');
            expect(result).toBe(
                'https://www.youtube-nocookie.com/embed/xyz789',
            );
        });

        it('extracts video id from youtube.com/watch', () => {
            const result = getYouTubeEmbedUrl(
                'https://www.youtube.com/watch?v=watchId123',
            );
            expect(result).toBe(
                'https://www.youtube-nocookie.com/embed/watchId123',
            );
        });

        it('extracts video id from m.youtube.com/watch', () => {
            const result = getYouTubeEmbedUrl(
                'https://m.youtube.com/watch?v=mobileId',
            );
            expect(result).toBe(
                'https://www.youtube-nocookie.com/embed/mobileId',
            );
        });

        it('extracts video id from /shorts/ path', () => {
            const result = getYouTubeEmbedUrl(
                'https://www.youtube.com/shorts/shortId456',
            );
            expect(result).toBe(
                'https://www.youtube-nocookie.com/embed/shortId456',
            );
        });

        it('extracts video id from /embed/ path', () => {
            const result = getYouTubeEmbedUrl(
                'https://www.youtube.com/embed/embedId789',
            );
            expect(result).toBe(
                'https://www.youtube-nocookie.com/embed/embedId789',
            );
        });

        it('returns undefined for non-YouTube URL', () => {
            expect(getYouTubeEmbedUrl('https://example.com/video')).toBeUndefined();
        });

        it('appends start seconds from t= (digits only)', () => {
            const result = getYouTubeEmbedUrl(
                'https://www.youtube.com/watch?v=q&t=42',
            );
            expect(result).toContain('start=42');
        });

        it('appends start seconds from t= with h/m/s format', () => {
            const result = getYouTubeEmbedUrl(
                'https://www.youtube.com/watch?v=q&t=1m30s',
            );
            expect(result).toContain('start=90');
        });

        it('appends start seconds from start= param', () => {
            const result = getYouTubeEmbedUrl(
                'https://www.youtube.com/watch?v=q&start=120',
            );
            expect(result).toContain('start=120');
        });

        it('appends start seconds for 1h format', () => {
            const result = getYouTubeEmbedUrl(
                'https://www.youtube.com/watch?v=q&t=1h',
            );
            expect(result).toContain('start=3600');
        });
    });

    describe('moreResources array', () => {
        it('includes Cursor automations as the second video item', () => {
            const videoResources = moreResources.filter((r) => r.type === 'video');
            expect(videoResources[1]).toMatchObject({
                id: 'cursor-automations',
                label: 'Cursor automations',
                url: 'https://youtu.be/uKetgY5FB6s?si=o0F5Aoa7kuJpZKu2',
            });
            expect(videoResources[1]?.embedUrl).toBe(
                'https://www.youtube-nocookie.com/embed/uKetgY5FB6s',
            );
        });

        it('includes Cursor automations as the second article item', () => {
            const articleResources = moreResources.filter(
                (r) => r.type === 'article',
            );
            expect(articleResources[1]).toMatchObject({
                id: 'cursor-automation',
                label: 'Cursor automations',
                url: 'https://cursor.com/blog/automations',
            });
            expect(articleResources[1]?.embedUrl).toBeUndefined();
        });

        it('exports resources with embedUrl for YouTube links', () => {
            expect(moreResources.length).toBeGreaterThan(0);
            const videoResource = moreResources.find((r) => r.type === 'video');
            expect(videoResource?.embedUrl).toContain(
                'youtube-nocookie.com/embed/',
            );
        });

        it('includes the article resource without a YouTube embed URL', () => {
            const articleResource = moreResources.find(
                (r) =>
                    r.type === 'article' &&
                    r.label === 'How To Be A World-Class Agentic Engineer',
            );
            expect(articleResource).toBeDefined();
            expect(articleResource?.label).toBe(
                'How To Be A World-Class Agentic Engineer',
            );
            expect(articleResource?.url).toBe(
                'https://x.com/systematicls/status/2028814227004395561?s=46',
            );
            expect(articleResource?.embedUrl).toBeUndefined();
        });
    });
});
