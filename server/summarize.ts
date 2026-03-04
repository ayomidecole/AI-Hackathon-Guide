import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateSummaryUrl, streamSummary } from '../shared/summarizePolicy';

export const config = { runtime: 'nodejs' };

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).setHeader('Allow', 'GET').end();
    return;
  }

  const raw = req.query.url;
  const url = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : undefined;
  const validation = url ? validateSummaryUrl(url) : { ok: false as const, status: 400, error: 'Missing or invalid url' };
  if (!validation.ok) {
    res.status(validation.status).json({ error: validation.error });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'OpenAI API key not configured' });
    return;
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200);

  try {
    for await (const chunk of streamSummary(apiKey, url!)) {
      res.write(chunk);
    }
  } catch (err) {
    console.error('[summarize]', err);
    res.write('[Summary failed]');
  } finally {
    res.end();
  }
}
