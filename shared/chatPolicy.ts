import { sections } from '../src/content/sections'

export interface ChatMessage {
  role: string
  content: string
}

export interface ChatContext {
  toolId: string
  toolName: string
  toolDescription: string
}

export interface ChatRequestBody {
  messages?: ChatMessage[]
  mode?: string
  context?: ChatContext
}

type SectionCategory =
  | 'development'
  | 'database'
  | 'auth'
  | 'deployment'
  | 'terminal'
  | 'api'
  | 'other'

interface GuideTool {
  id: string
  name: string
  tagline: string
  description: string
  sectionTitle: string
  category: SectionCategory
  normalizedName: string
  searchText: string
  aliases: string[]
}

// Suggest-stack (vanilla OpenAI, structured JSON) types
export type SuggestStackKind = 'clarification' | 'stack'

export interface GuideToolSummary {
  name: string
  category: string
  tagline: string
}

export interface SuggestStackTool {
  name: string
  category: string
  reason: string
}

export interface SuggestStackStack {
  summary: string
  dev_tool: string
  core_tools: SuggestStackTool[]
  optional_later: SuggestStackTool[]
  setup_note: string
}

export interface SuggestStackResponse {
  kind: SuggestStackKind
  clarifying_question: string | null
  stack: SuggestStackStack | null
}

const DEFAULT_SYSTEM_PROMPT =
  'You are an assistant for the AI Hackathon Guide. Help users find tools, compare options (e.g. Cursor vs Replit), and get quick tips for building AI apps during hackathons. Be concise and actionable.'

const OPENAI_CHAT_COMPLETIONS_URL = 'https://api.openai.com/v1/chat/completions'

const SECTION_TO_CATEGORY: Record<string, SectionCategory> = {
  'development tools': 'development',
  databases: 'database',
  auth: 'auth',
  deployment: 'deployment',
  terminal: 'terminal',
  apis: 'api',
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(' ')
    .filter((token) => token.length >= 3)
}

function getSectionCategory(sectionTitle: string): SectionCategory {
  const normalized = normalizeText(sectionTitle)
  return SECTION_TO_CATEGORY[normalized] ?? 'other'
}

function buildToolAliases(toolId: string, toolName: string): string[] {
  const aliases = new Set<string>([toolName])

  if (toolId === 'openai') {
    aliases.add('openai')
    aliases.add('openai api')
  }

  if (toolId === 'nextauth') {
    aliases.add('nextauth')
    aliases.add('next auth')
    aliases.add('authjs')
    aliases.add('auth js')
  }

  if (toolId === 'claude-code') {
    aliases.add('claude')
    aliases.add('claude code')
  }

  return Array.from(aliases)
}

const GUIDE_TOOLS: GuideTool[] = sections.flatMap((section) =>
  section.tools.map((tool) => ({
    id: tool.id,
    name: tool.name,
    tagline: tool.tagline,
    description: tool.description,
    sectionTitle: section.title,
    category: getSectionCategory(section.title),
    normalizedName: normalizeText(tool.name),
    searchText: normalizeText(
      [tool.name, tool.tagline, tool.description, ...tool.bullets, section.title].join(' ')
    ),
    aliases: buildToolAliases(tool.id, tool.name),
  }))
)

function getSuggestStackToolList(): GuideToolSummary[] {
  return sections.flatMap((section) =>
    section.tools.map((tool) => ({
      name: tool.name,
      category: getSectionCategory(section.title),
      tagline: tool.tagline,
    }))
  )
}

function buildSuggestStackSystemPrompt(tools: GuideToolSummary[]): string {
  const toolListText = tools
    .map((t) => `- ${t.name} (${t.category}): ${t.tagline}`)
    .join('\n')

  return [
    'You are a stack advisor for vibe coders. A vibe coder will NOT read or write code; they use AI coding agents (e.g. Cursor, Codex) and product dashboards/UIs only. Your recommendations must assume the user never touches code.',
    '',
    'Reason about the user\'s idea: do they need auth (multi-user vs single-user), persistence (saved data vs ephemeral), external APIs, AI/LLM features, or deployment? Recommend a minimal stack that matches.',
    '',
    'Guide tools (prefer these when they fit; suggest a non-Guide tool only when clearly better for a non-coder):',
    toolListText,
    '',
    'Respond with valid JSON only. No markdown, no code fence. Use exactly one of these shapes:',
    '',
    'If you need one clarifying question that would change the stack, use: {"kind":"clarification","clarifying_question":"Your single short question here","stack":null}',
    '',
    'Otherwise use: {"kind":"stack","clarifying_question":null,"stack":{"summary":"One short sentence.","dev_tool":"Tool name","core_tools":[{"name":"...","category":"auth|database|api|deployment|other","reason":"Why this fits a non-coder."}],"optional_later":[{"name":"...","category":"...","reason":"Why later."}],"setup_note":"Short concrete steps: install/open X, ask your agent to… or use dashboard to… Only agent + dashboard steps, no code."}}',
    '',
    'Rules:',
    '- Minimal stack: 1 dev_tool + up to a few core_tools, 0–2 optional_later.',
    '- At most one clarifying question; only if the answer materially changes the stack.',
    '- setup_note and reasons must only describe agent/dashboard steps. Never say "write code", "implement X in React", "create a Spring Boot app". Say "open your AI dev tool and ask it to…" or "use the X dashboard to…".',
    '- Keep language high-level and beginner-friendly.',
  ].join('\n')
}

function getFallbackRankedTools(): GuideTool[] {
  return [...GUIDE_TOOLS]
}

export function rankGuideToolsByQuery(query: string, limit = 20): GuideTool[] {
  const queryNormalized = normalizeText(query)
  const queryTokens = tokenize(query)

  const scored = GUIDE_TOOLS.map((tool, index) => {
    let score = 0

    if (queryNormalized.includes(tool.normalizedName)) {
      score += 10
    }

    for (const token of queryTokens) {
      if (tool.normalizedName.includes(token)) {
        score += 3
      }
      if (tool.searchText.includes(token)) {
        score += 1
      }
    }

    return { tool, score, index }
  })

  const ranked = scored
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.index - b.index
    })
    .map((entry) => entry.tool)

  if (!scored.some((entry) => entry.score > 0)) {
    return getFallbackRankedTools().slice(0, limit)
  }

  return ranked.slice(0, limit)
}

function sanitizeMessages(messages: ChatMessage[]): { role: 'user' | 'assistant'; content: string }[] {
  return messages
    .filter((message) => message && typeof message.content === 'string')
    .map((message) => ({ role: message.role, content: message.content.trim() }))
    .filter((message) => Boolean(message.content))
    .filter(
      (
        message
      ): message is {
        role: 'user' | 'assistant'
        content: string
      } => message.role === 'user' || message.role === 'assistant'
    )
}

function getLatestUserMessage(messages: { role: 'user' | 'assistant'; content: string }[]): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index].role === 'user') {
      return messages[index].content
    }
  }

  return messages[messages.length - 1]?.content ?? ''
}

export function buildSystemPrompt(opts: {
  mode?: string
  context?: ChatContext
}): string {
  if (opts.context) {
    return `The user is asking about ${opts.context.toolName}. Use this description: ${opts.context.toolDescription}. Answer their question concisely.`
  }

  return DEFAULT_SYSTEM_PROMPT
}

export function getModelForMode(mode?: string): string {
  return mode === 'suggest-stack' ? 'gpt-4o' : 'gpt-4o-mini'
}

function formatSuggestStackMarkdown(stack: SuggestStackStack): string {
  const lines: string[] = [stack.summary, '']
  lines.push(`- Start with **${stack.dev_tool}** – use it as your main AI dev environment to build the first version.`)
  for (const t of stack.core_tools) {
    lines.push(`- **${t.name}** (${t.category}): ${t.reason}`)
  }
  if (stack.optional_later.length > 0) {
    const later = stack.optional_later.map((t) => `${t.name} for ${t.reason}`).join('; ')
    lines.push(`- Later if needed: ${later}`)
  }
  lines.push(`- To get started: ${stack.setup_note}`)
  return lines.join('\n')
}

function buildSuggestStackFallbackResponse(latestUserMessage: string): string {
  const ranked = rankGuideToolsByQuery(latestUserMessage, 5)
  const devTool = ranked.find((t) => t.category === 'development') ?? ranked[0]
  if (!devTool) {
    return [
      'Start with your preferred AI dev tool and ask it to build a minimal version of your idea.',
      '- Open Cursor, Codex, or Replit and describe what you want to build.',
      '- Keep the first version to one core flow; add more after it works.',
    ].join('\n')
  }
  return [
    `Keep the first version lean. Start with **${devTool.name}** – ${devTool.tagline}.`,
    `- Open ${devTool.name} and ask it to build a minimal version of your idea.`,
    '- Use the agent for everything; no need to write code yourself.',
    '- Add a database or auth later only if you need saved data or user accounts.',
  ].join('\n')
}

function buildCompletion(params: { model: string; content: string; id?: string }) {
  return {
    id: params.id || 'chatcmpl-fallback',
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: params.model,
    choices: [
      {
        index: 0,
        finish_reason: 'stop',
        message: {
          role: 'assistant',
          content: params.content,
        },
      },
    ],
  }
}

async function fetchChatCompletion(params: {
  apiKey: string
  model: string
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
  response_format?: { type: 'json_object' }
}): Promise<
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; status: number; error: string }
> {
  try {
    const body: Record<string, unknown> = {
      model: params.model,
      messages: params.messages,
    }
    if (params.response_format) {
      body.response_format = params.response_format
    }
    const response = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      },
      body: JSON.stringify(body),
    })

    const data = (await response.json()) as {
      error?: { message?: string }
      [key: string]: unknown
    }

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: data.error?.message || 'OpenAI API error',
      }
    }

    return { ok: true, data }
  } catch {
    return {
      ok: false,
      status: 500,
      error: 'Internal server error',
    }
  }
}

function getAssistantContent(payload: Record<string, unknown>): string {
  const choices = payload.choices
  if (!Array.isArray(choices)) return ''

  const firstChoice = choices[0] as
    | {
        message?: { content?: string }
      }
    | undefined

  return firstChoice?.message?.content?.trim() || ''
}

function shouldDebugLog(): boolean {
  return process.env.NODE_ENV !== 'production'
}

function logDebug(event: string, data: Record<string, unknown>): void {
  if (!shouldDebugLog()) return
  console.info(`[chat-policy] ${event}`, data)
}

export async function handleChatRequest(
  apiKey: string | undefined,
  body: ChatRequestBody
): Promise<{ status: number; json: Record<string, unknown> }> {
  if (!apiKey) {
    return { status: 500, json: { error: 'OPENAI_API_KEY is not configured' } }
  }

  if (!body?.messages || !Array.isArray(body.messages)) {
    return { status: 400, json: { error: 'messages array is required' } }
  }

  const sanitizedMessages = sanitizeMessages(body.messages)
  if (sanitizedMessages.length === 0) {
    return { status: 400, json: { error: 'messages array must contain user/assistant messages' } }
  }

  const latestUserMessage = getLatestUserMessage(sanitizedMessages)
  const model = getModelForMode(body.mode)

  if (body.mode === 'suggest-stack') {
    const tools = getSuggestStackToolList()
    const systemPrompt = buildSuggestStackSystemPrompt(tools)
    const baseMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt },
      ...sanitizedMessages,
    ]
    const result = await fetchChatCompletion({
      apiKey: apiKey as string,
      model,
      messages: baseMessages,
      response_format: { type: 'json_object' },
    })
    if (!result.ok) {
      logDebug('suggest_stack_error', { status: result.status })
      return { status: result.status, json: { error: result.error } }
    }
    const content = getAssistantContent(result.data)
    let parsed: SuggestStackResponse
    try {
      parsed = JSON.parse(content) as SuggestStackResponse
    } catch {
      logDebug('suggest_stack_parse_failed', {})
      const fallbackContent = buildSuggestStackFallbackResponse(latestUserMessage)
      return { status: 200, json: buildCompletion({ model, content: fallbackContent }) }
    }
    if (parsed.kind === 'clarification' && parsed.clarifying_question) {
      return {
        status: 200,
        json: buildCompletion({
          id: 'chatcmpl-clarify',
          model,
          content: parsed.clarifying_question,
        }),
      }
    }
    if (parsed.kind === 'stack' && parsed.stack) {
      const markdown = formatSuggestStackMarkdown(parsed.stack)
      return { status: 200, json: buildCompletion({ model, content: markdown }) }
    }
    const fallbackContent = buildSuggestStackFallbackResponse(latestUserMessage)
    return { status: 200, json: buildCompletion({ model, content: fallbackContent }) }
  }

  const systemPrompt = buildSystemPrompt({ mode: body.mode, context: body.context })
  const baseMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: systemPrompt },
    ...sanitizedMessages,
  ]
  logDebug('request_start', {
    mode: body.mode || 'default',
    model,
    messageCount: sanitizedMessages.length,
  })
  const attempt = await fetchChatCompletion({
    apiKey: apiKey as string,
    model,
    messages: baseMessages,
  })
  if (!attempt.ok) {
    logDebug('first_attempt_error', {
      mode: body.mode || 'default',
      status: attempt.status,
    })
    return { status: attempt.status, json: { error: attempt.error } }
  }
  return { status: 200, json: attempt.data }
}
