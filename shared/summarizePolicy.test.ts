import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    getPageText,
    streamSummary,
    validateSummaryUrl,
} from './summarizePolicy';

describe('validateSummaryUrl', () => {
    it('rejects empty or non-http url', () => {
        expect(validateSummaryUrl('')).toMatchObject({
            ok: false,
            status: 400,
            error: 'Missing or invalid url',
        });
        expect(validateSummaryUrl('ftp://x')).toMatchObject({
            ok: false,
            status: 400,
            error: 'Missing or invalid url',
        });
    });

    it('rejects invalid URL', () => {
        expect(validateSummaryUrl('http://')).toMatchObject({
            ok: false,
            status: 400,
            error: 'Invalid url',
        });
    });

    it('rejects non-http(s) protocol', () => {
        expect(validateSummaryUrl('httpother://example.com')).toMatchObject({
            ok: false,
            status: 400,
            error: 'Only http(s) URLs allowed',
        });
    });

    it('accepts http and https', () => {
        expect(validateSummaryUrl('http://example.com')).toEqual({ ok: true });
        expect(validateSummaryUrl('https://example.com/path')).toEqual({
            ok: true,
        });
    });
});

describe('getPageText', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('returns error when url is invalid', async () => {
        const result = await getPageText('');
        expect(result).toMatchObject({ ok: false, error: 'Missing or invalid url' });
    });

    it('returns error when fetch fails', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network')));
        const result = await getPageText('https://example.com');
        expect(result).toMatchObject({ ok: false, error: 'Failed to fetch URL' });
    });

    it('returns error when response is not ok', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));
        const result = await getPageText('https://example.com');
        expect(result).toMatchObject({ ok: false, error: 'Upstream returned 404' });
    });

    it('returns error when content-type is not HTML', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            headers: new Headers({ 'content-type': 'application/json' }),
            text: () => Promise.resolve('{}'),
        }));
        const result = await getPageText('https://example.com');
        expect(result).toMatchObject({ ok: false, error: 'URL did not return HTML' });
    });

    it('returns error when page has too little text', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            headers: new Headers({ 'content-type': 'text/html' }),
            text: () => Promise.resolve('<html><body><p>x</p></body></html>'),
        }));
        const result = await getPageText('https://example.com');
        expect(result).toMatchObject({ ok: false, error: 'Page had too little text to summarize' });
    });

    it('returns extracted text from HTML', async () => {
        const html = '<html><head><script>bad()</script></head><body><p>Hello world content here for summary.</p><p>More text so we exceed fifty characters easily.</p></body></html>';
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            headers: new Headers({ 'content-type': 'text/html' }),
            text: () => Promise.resolve(html),
        }));
        const result = await getPageText('https://example.com');
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.text).not.toContain('bad');
            expect(result.text).toContain('Hello world');
        }
    });
});

describe('streamSummary', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('yields error when getPageText fails', async () => {
        (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('net'));
        const chunks: string[] = [];
        for await (const chunk of streamSummary('key', 'https://example.com')) {
            chunks.push(chunk);
        }
        expect(chunks.join('')).toContain('[Unable to summarize:');
    });

    it('yields error message when OpenAI returns not ok', async () => {
        (globalThis.fetch as ReturnType<typeof vi.fn>)
            .mockResolvedValueOnce({
                ok: true,
                headers: new Headers({ 'content-type': 'text/html' }),
                text: () => Promise.resolve('<body>' + 'x'.repeat(60) + '</body>'),
            })
            .mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: () => Promise.resolve({ error: { message: 'Server error' } }),
            });
        const chunks: string[] = [];
        for await (const chunk of streamSummary('key', 'https://example.com')) {
            chunks.push(chunk);
        }
        expect(chunks.join('')).toContain('Summary failed');
    });

    it('yields content chunks from OpenAI stream', async () => {
        const chunksData = [
            'data: {"choices":[{"delta":{"content":"Hi "}}]}\n\n',
            'data: {"choices":[{"delta":{"content":"there"}}]}\n\n',
            'data: [DONE]\n\n',
        ];
        let i = 0;
        (globalThis.fetch as ReturnType<typeof vi.fn>)
            .mockResolvedValueOnce({
                ok: true,
                headers: new Headers({ 'content-type': 'text/html' }),
                text: () => Promise.resolve('<body>' + 'x'.repeat(60) + '</body>'),
            })
            .mockResolvedValueOnce({
                ok: true,
                body: {
                    getReader: () => ({
                        read: () =>
                            Promise.resolve(
                                i < chunksData.length
                                    ? { done: false, value: new TextEncoder().encode(chunksData[i++]) }
                                    : { done: true, value: undefined },
                            ),
                        releaseLock: () => {},
                    }),
                },
            });
        const chunks: string[] = [];
        for await (const chunk of streamSummary('key', 'https://example.com')) {
            chunks.push(chunk);
        }
        expect(chunks).toContain('Hi ');
        expect(chunks).toContain('there');
    });
});
