import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sections } from '../src/content/sections'

const DEFAULT_SYSTEM_PROMPT =
  'You are an assistant for the AI Hackathon Guide. Help users find tools, compare options (e.g. Cursor vs Replit), and get quick tips for building AI apps during hackathons. Be concise and actionable.'

function buildGuideToolsOverview(): string {
  const toolsBySection = sections
    .filter((section) => section.tools.length > 0)
    .map((section) => {
      const toolNames = section.tools.map((tool) => tool.name).join(', ')
      return `- ${section.title}: ${toolNames}`
    })

  if (toolsBySection.length === 0) {
    return '- No tools listed in the guide yet.'
  }

  return toolsBySection.join('\n')
}

const GUIDE_TOOLS_OVERVIEW = buildGuideToolsOverview()

function buildSystemPrompt(opts: {
  mode?: string
  context?: { toolId: string; toolName: string; toolDescription: string }
}): string {
  if (opts.mode === 'suggest-stack') {
    return [
      'You suggest tech stacks for vibe coders (AI-assisted coding, minimal config, ship fast).',
      '',
      'NEVER recommend these as the main stack: Node.js, Express, React (by itself), MongoDB, Firebase (generic). They are generic code-first options. You MUST recommend tools from the Guide list below instead.',
      '',
      'Guide tools — you MUST pick at least 2–3 of these by name in every response:',
      GUIDE_TOOLS_OVERVIEW,
      '',
      'Example of a CORRECT response for "a task app":',
      '- **Cursor** [Guide] — Your AI pair programmer. Describe the task app in chat; Cursor scaffolds the UI and logic. Setup: already in your editor. Use Plan Mode (Shift+Tab) to get a step-by-step before it writes code.',
      '- **Supabase** [Guide] — Database and auth in one. Create tables in the dashboard, get a ready API. No SQL or server code. Use the client lib; ask Cursor to wire it to your frontend.',
      '- **Vercel** [Guide] — One-click deploy from Git. Push and it builds and ships. Connect your repo; no config for a typical Next/Vite app.',
      '',
      'Example of a WRONG response (do not do this): "Node.js for the backend, MongoDB for data, Firebase Auth for login" — that is a generic stack with zero Guide tools.',
      '',
      'For each tool you recommend: **Name** [Guide] or [Other], one line why it fits, setup effort, then 1 sentence on how to use it as a vibe coder (e.g. "Ask Cursor to add auth" or "Supabase dashboard for tables"). Use markdown bullets and **bold** names. Keep it short.',
    ].join('\n')
  }
  if (opts.context) {
    return `The user is asking about ${opts.context.toolName}. Use this description: ${opts.context.toolDescription}. Answer their question concisely.`
  }
  return DEFAULT_SYSTEM_PROMPT
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'OPENAI_API_KEY is not configured' })
    return
  }

  const body = req.body as {
    messages?: { role: string; content: string }[]
    mode?: string
    context?: { toolId: string; toolName: string; toolDescription: string }
  }

  if (!body?.messages || !Array.isArray(body.messages)) {
    res.status(400).json({ error: 'messages array is required' })
    return
  }

  const systemPrompt = buildSystemPrompt({
    mode: body.mode,
    context: body.context,
  })

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...body.messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  ]

  const model = body.mode === 'suggest-stack' ? 'gpt-4o' : 'gpt-4o-mini'
  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    })

    const data = (await openaiRes.json()) as { error?: { message?: string } }
    if (!openaiRes.ok) {
      res
        .status(openaiRes.status)
        .json({ error: data.error?.message || 'OpenAI API error' })
      return
    }
    res.status(200).json(data)
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}
