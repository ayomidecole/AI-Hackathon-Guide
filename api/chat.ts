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
      'You are a hackathon stack advisor focused on vibe-coding speed.',
      'Prioritize tools from this AI Hackathon Guide first, because they are already curated in-app.',
      'Only include a non-guide tool when absolutely necessary, and only if it is widely used and easy to set up.',
      '',
      'Guide tools:',
      GUIDE_TOOLS_OVERVIEW,
      '',
      'Response rules:',
      '1) Recommend 3-5 tools for the user idea (covering dev, backend/data, auth, deployment when relevant).',
      '2) Favor tools that are popular for vibe coding and quick to start.',
      '3) For each recommended tool, include: why it fits + setup effort (example: "setup: 5-15 min").',
      '4) Keep it concise and actionable with bullet points.',
      '5) If the idea is vague, ask one clarifying question and also provide a sensible default stack.',
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

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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
