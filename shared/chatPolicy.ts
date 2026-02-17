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

type Complexity = 'simple' | 'medium' | 'complex'

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

export interface CapabilityConfidence {
  needsAuth: number
  needsDatabase: number
  needsDeployment: number
  needsExternalApi: number
  needsAiApi: number
}

export interface StackIntent {
  confidence: CapabilityConfidence
  complexity: Complexity
  complexityScore: number
  maxPrimaryTools: number
  requires: {
    auth: boolean
    database: boolean
    deployment: boolean
    externalApi: boolean
    aiApi: boolean
  }
  ambiguous: {
    auth: boolean
    database: boolean
  }
  explicitNegations: {
    auth: boolean
    database: boolean
  }
  alreadyAskedClarifyingQuestion: boolean
  shouldAskClarifyingQuestion: boolean
}

export interface PolicyViolations {
  missingDevelopmentTool: boolean
  unneededAuth: boolean
  unneededDatabase: boolean
  tooManyTools: boolean
  containsLowLevelDetails: boolean
  tooVerbose: boolean
  details: string[]
}

interface StackPlan {
  primaryTools: GuideTool[]
  addLaterTools: GuideTool[]
  alternativeTools: GuideTool[]
}

interface SuggestValidation {
  isValid: boolean
  mentionedToolNames: string[]
  primaryToolNames: string[]
  violations: PolicyViolations
}

interface IntentSignals {
  hasMultiUserLanguage: boolean
  hasRealtimeOrBackgroundLanguage: boolean
  hasDeploymentLanguage: boolean
}

const DEFAULT_SYSTEM_PROMPT =
  'You are an assistant for the AI Hackathon Guide. Help users find tools, compare options (e.g. Cursor vs Replit), and get quick tips for building AI apps during hackathons. Be concise and actionable.'

const OPENAI_CHAT_COMPLETIONS_URL = 'https://api.openai.com/v1/chat/completions'

const REQUIRED_THRESHOLD = 0.65
const AMBIGUOUS_THRESHOLD_MIN = 0.4
const AMBIGUOUS_THRESHOLD_MAX = 0.64
const CLARIFYING_QUESTION =
  "Do you need user accounts or saved data in the first version? If no, I'll keep it no-auth and no-database."

const AUTH_POSITIVE_PATTERNS = [
  /\blogin\b/i,
  /\bsign[ -]?in\b/i,
  /\bsign[ -]?up\b/i,
  /\buser accounts?\b/i,
  /\baccounts?\b/i,
  /\bauth(?:entication)?\b/i,
  /\bsessions?\b/i,
  /\bpermissions?\b/i,
  /\bprofiles?\b/i,
]

const AUTH_NEGATIVE_PATTERNS = [
  /\bno auth\b/i,
  /\bwithout auth\b/i,
  /\bno login\b/i,
  /\bwithout login\b/i,
  /\bno user accounts?\b/i,
  /\banonymous users?\b/i,
  /\bguest mode\b/i,
  /\bsingle user\b/i,
]

const DATABASE_POSITIVE_PATTERNS = [
  /\bsave\b/i,
  /\bsaved\b/i,
  /\bstore data\b/i,
  /\bstored\b/i,
  /\bpersist(?:ence|ent)?\b/i,
  /\bhistory\b/i,
  /\bdatabase\b/i,
  /\bdb\b/i,
  /\bpostgres\b/i,
  /\bsupabase\b/i,
  /\brecords?\b/i,
  /\bcrud\b/i,
  /\brealtime\b/i,
  /\bsync\b/i,
]

const DATABASE_NEGATIVE_PATTERNS = [
  /\bno database\b/i,
  /\bwithout database\b/i,
  /\bno db\b/i,
  /\bwithout db\b/i,
  /\bstateless\b/i,
  /\bno persistence\b/i,
  /\bin-memory only\b/i,
  /\bclient-only\b/i,
]

const DEPLOYMENT_PATTERNS = [
  /\bdeploy\b/i,
  /\bdeployment\b/i,
  /\bhost\b/i,
  /\bhosting\b/i,
  /\bproduction\b/i,
  /\bship\b/i,
  /\blaunch\b/i,
  /\bgo live\b/i,
  /\bshare\b/i,
  /\bpublic url\b/i,
]

const EXTERNAL_API_PATTERNS = [
  /\bexternal api\b/i,
  /\bpublic api\b/i,
  /\bthird-party api\b/i,
  /\bapi\b/i,
  /\bcompare\b.*\bprices?\b/i,
  /\bprices?\b/i,
  /\bdifferent stores?\b/i,
  /\bweather\b/i,
  /\bstock\b/i,
  /\bflight\b/i,
  /\bmarket data\b/i,
]

const AI_API_PATTERNS = [
  /\bai\b/i,
  /\bllm\b/i,
  /\bopenai\b/i,
  /\bgpt\b/i,
  /\bchatbot\b/i,
  /\bassistant\b/i,
  /\bsummar(?:ize|ise|ization)\b/i,
  /\bembeddings?\b/i,
]

const MULTI_USER_PATTERNS = [/\bmulti-user\b/i, /\bteam\b/i, /\bcollaborat/i, /\bshared\b/i]
const MARKETPLACE_AMBIGUITY_PATTERNS = [
  /\bmarketplace\b/i,
  /\bplatform\b/i,
  /\bcommunity\b/i,
  /\bdirectory\b/i,
  /\bportal\b/i,
]

const REALTIME_OR_BACKGROUND_PATTERNS = [
  /\brealtime\b/i,
  /\bbackground\b/i,
  /\bcron\b/i,
  /\bqueue\b/i,
  /\bwebhook\b/i,
  /\bworker\b/i,
]

const LOW_LEVEL_DETAIL_PATTERNS = [
  /\bhtml\b/i,
  /\bcss\b/i,
  /\bjavascript\b/i,
  /\btypescript\b/i,
  /\bcreate files?\b/i,
  /\bfile[- ]by[- ]file\b/i,
  /\bwebpack\b/i,
  /\bboilerplate\b/i,
  /\bfolder structure\b/i,
  /\bsetup config\b/i,
]

const SECTION_TO_CATEGORY: Record<string, SectionCategory> = {
  'development tools': 'development',
  databases: 'database',
  auth: 'auth',
  deployment: 'deployment',
  terminal: 'terminal',
  apis: 'api',
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value))
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

function countPatternMatches(text: string, patterns: RegExp[]): number {
  return patterns.reduce((total, pattern) => total + (pattern.test(text) ? 1 : 0), 0)
}

function hasPatternMatch(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text))
}

function isRequired(confidence: number): boolean {
  return confidence >= REQUIRED_THRESHOLD
}

function isAmbiguous(confidence: number): boolean {
  return confidence >= AMBIGUOUS_THRESHOLD_MIN && confidence <= AMBIGUOUS_THRESHOLD_MAX
}

function getMaxPrimaryTools(complexity: Complexity): number {
  if (complexity === 'simple') return 2
  if (complexity === 'medium') return 3
  return 4
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

const GUIDE_TOOL_NAMES = new Set(GUIDE_TOOLS.map((tool) => tool.name))
const GUIDE_TOOL_BY_NAME = new Map(GUIDE_TOOLS.map((tool) => [tool.name, tool]))

function getToolsByCategory(category: SectionCategory): GuideTool[] {
  return GUIDE_TOOLS.filter((tool) => tool.category === category)
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

function hasAskedClarifyingQuestion(messages: { role: 'user' | 'assistant'; content: string }[]): boolean {
  const normalizedQuestion = normalizeText(CLARIFYING_QUESTION)

  return messages.some(
    (message) =>
      message.role === 'assistant' && normalizeText(message.content).includes(normalizedQuestion)
  )
}

function inferCapabilityConfidence(message: string): {
  confidence: CapabilityConfidence
  explicitNegations: { auth: boolean; database: boolean }
  signals: IntentSignals
} {
  const authPositiveMatches = countPatternMatches(message, AUTH_POSITIVE_PATTERNS)
  const authNegativeMatches = countPatternMatches(message, AUTH_NEGATIVE_PATTERNS)

  const databasePositiveMatches = countPatternMatches(message, DATABASE_POSITIVE_PATTERNS)
  const databaseNegativeMatches = countPatternMatches(message, DATABASE_NEGATIVE_PATTERNS)

  const deploymentMatches = countPatternMatches(message, DEPLOYMENT_PATTERNS)
  const externalApiMatches = countPatternMatches(message, EXTERNAL_API_PATTERNS)
  const aiApiMatches = countPatternMatches(message, AI_API_PATTERNS)

  const hasMultiUserLanguage = hasPatternMatch(message, MULTI_USER_PATTERNS)
  const hasRealtimeOrBackgroundLanguage = hasPatternMatch(message, REALTIME_OR_BACKGROUND_PATTERNS)
  const hasMarketplaceAmbiguity = hasPatternMatch(message, MARKETPLACE_AMBIGUITY_PATTERNS)
  const hasDeploymentLanguage = deploymentMatches > 0
  const hasExplicitLoginLanguage =
    /\blogin\b/i.test(message) || /\bsign[ -]?in\b/i.test(message) || /\bauth(?:entication)?\b/i.test(message)
  const hasSavedDataLanguage = /\bsaved?\s+(tasks?|items?|records?|data|history|messages?)\b/i.test(
    message
  )
  const hasChatHistoryLanguage =
    /\bchat history\b/i.test(message) ||
    /\bconversation history\b/i.test(message) ||
    /\bhistory\b.*\bchat\b/i.test(message)
  const hasGroceryPriceComparison =
    /\bcompar(?:e|es|ing)\b.*\bprices?\b/i.test(message) ||
    (/\bgrocery\b/i.test(message) && /\bprices?\b/i.test(message))
  const hasCompareStoresLanguage = /\bcompar(?:e|es|ing)\b/i.test(message) && /\bstores?\b/i.test(message)
  const hasAiAppLanguage = /\b(ai|llm|gpt|openai|assistant|chatbot)\b/i.test(message)
  const hasAiStudyAssistantLanguage = /\bai study assistant\b/i.test(message)

  const needsAuth = clamp(
    0.08 +
      authPositiveMatches * 0.52 +
      (hasExplicitLoginLanguage ? 0.16 : 0) +
      (hasMultiUserLanguage ? 0.15 : 0) +
      (hasMarketplaceAmbiguity ? 0.38 : 0) -
      authNegativeMatches * 0.75
  )

  const needsDatabase = clamp(
    0.08 +
      databasePositiveMatches * 0.3 +
      (hasSavedDataLanguage ? 0.42 : 0) +
      (hasChatHistoryLanguage ? 0.38 : 0) +
      (hasRealtimeOrBackgroundLanguage ? 0.16 : 0) +
      (hasMultiUserLanguage ? 0.08 : 0) -
      (hasMarketplaceAmbiguity ? 0.35 : 0) -
      databaseNegativeMatches * 0.8
  )

  const needsDeployment = clamp(0.05 + deploymentMatches * 0.3 + (hasMultiUserLanguage ? 0.08 : 0))

  const needsExternalApi = clamp(
    0.05 +
      externalApiMatches * 0.24 +
      (hasGroceryPriceComparison ? 0.35 : 0) +
      (hasCompareStoresLanguage ? 0.12 : 0)
  )

  const needsAiApi = clamp(
    0.03 +
      aiApiMatches * 0.34 +
      (hasAiStudyAssistantLanguage ? 0.32 : 0) +
      (hasChatHistoryLanguage && hasAiAppLanguage ? 0.18 : 0)
  )

  return {
    confidence: {
      needsAuth,
      needsDatabase,
      needsDeployment,
      needsExternalApi,
      needsAiApi,
    },
    explicitNegations: {
      auth: authNegativeMatches > 0,
      database: databaseNegativeMatches > 0,
    },
    signals: {
      hasMultiUserLanguage,
      hasRealtimeOrBackgroundLanguage,
      hasDeploymentLanguage,
    },
  }
}

function inferComplexityScore(intent: {
  confidence: CapabilityConfidence
  signals: IntentSignals
  requires: { auth: boolean; database: boolean; aiApi: boolean }
}): number {
  let score = 0

  if (intent.requires.auth) score += 1
  if (intent.requires.database) score += 1
  if (intent.requires.aiApi) score += 1
  if (intent.signals.hasRealtimeOrBackgroundLanguage) score += 1
  if (intent.signals.hasMultiUserLanguage) score += 1

  if (
    !intent.requires.auth &&
    !intent.requires.database &&
    !intent.requires.aiApi &&
    intent.confidence.needsDeployment >= REQUIRED_THRESHOLD
  ) {
    score += 1
  }

  return score
}

function scoreToComplexity(score: number): Complexity {
  if (score <= 1) return 'simple'
  if (score === 2) return 'medium'
  return 'complex'
}

function inferStackIntent(
  latestUserMessage: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
): StackIntent {
  const { confidence, explicitNegations, signals } = inferCapabilityConfidence(latestUserMessage)

  const requiresAuth = isRequired(confidence.needsAuth) && !explicitNegations.auth
  const requiresDatabase = isRequired(confidence.needsDatabase) && !explicitNegations.database

  const ambiguousAuth = isAmbiguous(confidence.needsAuth) && !explicitNegations.auth
  const ambiguousDatabase = isAmbiguous(confidence.needsDatabase) && !explicitNegations.database

  const alreadyAskedClarifyingQuestion = hasAskedClarifyingQuestion(messages)
  const shouldAskClarifyingQuestion =
    (ambiguousAuth || ambiguousDatabase) && !alreadyAskedClarifyingQuestion

  const complexityScore = inferComplexityScore({
    confidence,
    signals,
    requires: {
      auth: requiresAuth,
      database: requiresDatabase,
      aiApi: isRequired(confidence.needsAiApi),
    },
  })

  const complexity = scoreToComplexity(complexityScore)

  const requiresDeployment = isRequired(confidence.needsDeployment) || signals.hasDeploymentLanguage

  const requires = {
    auth: alreadyAskedClarifyingQuestion && ambiguousAuth ? false : requiresAuth,
    database: alreadyAskedClarifyingQuestion && ambiguousDatabase ? false : requiresDatabase,
    deployment: requiresDeployment,
    externalApi: isRequired(confidence.needsExternalApi),
    aiApi: isRequired(confidence.needsAiApi),
  }

  return {
    confidence,
    complexity,
    complexityScore,
    maxPrimaryTools: getMaxPrimaryTools(complexity),
    requires,
    ambiguous: {
      auth: ambiguousAuth,
      database: ambiguousDatabase,
    },
    explicitNegations,
    alreadyAskedClarifyingQuestion,
    shouldAskClarifyingQuestion,
  }
}

function selectTopToolByCategory(
  rankedTools: GuideTool[],
  category: SectionCategory,
  usedToolIds: Set<string>
): GuideTool | null {
  const rankedMatch = rankedTools.find((tool) => tool.category === category && !usedToolIds.has(tool.id))
  if (rankedMatch) return rankedMatch

  return getToolsByCategory(category).find((tool) => !usedToolIds.has(tool.id)) ?? null
}

function dedupeTools(tools: GuideTool[]): GuideTool[] {
  const seen = new Set<string>()
  return tools.filter((tool) => {
    if (seen.has(tool.id)) return false
    seen.add(tool.id)
    return true
  })
}

function buildStackPlan(intent: StackIntent, latestUserMessage: string): StackPlan {
  const rankedTools = rankGuideToolsByQuery(latestUserMessage, 40)
  const usedToolIds = new Set<string>()

  const primaryTools: GuideTool[] = []
  const addLaterTools: GuideTool[] = []

  const developmentTool = selectTopToolByCategory(rankedTools, 'development', usedToolIds)
  if (developmentTool) {
    primaryTools.push(developmentTool)
    usedToolIds.add(developmentTool.id)
  }

  const requiredCategoryOrder: SectionCategory[] = []

  if (intent.requires.aiApi) requiredCategoryOrder.push('api')
  if (intent.requires.database) requiredCategoryOrder.push('database')
  if (intent.requires.auth) requiredCategoryOrder.push('auth')
  if (intent.requires.deployment) requiredCategoryOrder.push('deployment')

  for (const category of requiredCategoryOrder) {
    const tool = selectTopToolByCategory(rankedTools, category, usedToolIds)
    if (!tool) continue
    primaryTools.push(tool)
    usedToolIds.add(tool.id)
  }

  if (intent.ambiguous.auth) {
    const authTool = selectTopToolByCategory(rankedTools, 'auth', usedToolIds)
    if (authTool) {
      addLaterTools.push(authTool)
      usedToolIds.add(authTool.id)
    }
  }

  if (intent.ambiguous.database) {
    const databaseTool = selectTopToolByCategory(rankedTools, 'database', usedToolIds)
    if (databaseTool) {
      addLaterTools.push(databaseTool)
      usedToolIds.add(databaseTool.id)
    }
  }

  if (!intent.requires.deployment && intent.complexity !== 'simple') {
    const deploymentTool = selectTopToolByCategory(rankedTools, 'deployment', usedToolIds)
    if (deploymentTool) {
      addLaterTools.push(deploymentTool)
      usedToolIds.add(deploymentTool.id)
    }
  }

  while (primaryTools.length > intent.maxPrimaryTools) {
    const overflow = primaryTools.pop()
    if (overflow) {
      addLaterTools.unshift(overflow)
    }
  }

  const alternatives: GuideTool[] = []

  const alternativeDev = rankedTools.find(
    (tool) =>
      tool.category === 'development' &&
      !primaryTools.some((primaryTool) => primaryTool.id === tool.id) &&
      !addLaterTools.some((laterTool) => laterTool.id === tool.id)
  )
  if (alternativeDev) {
    alternatives.push(alternativeDev)
  }

  const alternativeDeploy = rankedTools.find(
    (tool) =>
      tool.category === 'deployment' &&
      !primaryTools.some((primaryTool) => primaryTool.id === tool.id) &&
      !addLaterTools.some((laterTool) => laterTool.id === tool.id)
  )
  if (alternativeDeploy) {
    alternatives.push(alternativeDeploy)
  }

  return {
    primaryTools: dedupeTools(primaryTools),
    addLaterTools: dedupeTools(addLaterTools).slice(0, 2),
    alternativeTools: dedupeTools(alternatives).slice(0, 2),
  }
}

function buildCandidateToolsPromptBlock(plan: StackPlan): string {
  const lines: string[] = []

  lines.push('Primary candidate tools:')
  if (plan.primaryTools.length === 0) {
    lines.push('- None')
  } else {
    for (const tool of plan.primaryTools) {
      lines.push(`- ${tool.name} (${tool.sectionTitle}) - ${tool.tagline}`)
    }
  }

  if (plan.addLaterTools.length > 0) {
    lines.push('Optional add-later candidates:')
    for (const tool of plan.addLaterTools) {
      lines.push(`- ${tool.name} (${tool.sectionTitle}) - ${tool.tagline}`)
    }
  }

  if (plan.alternativeTools.length > 0) {
    lines.push('Alternatives if a candidate does not fit:')
    for (const tool of plan.alternativeTools) {
      lines.push(`- ${tool.name} (${tool.sectionTitle}) - ${tool.tagline}`)
    }
  }

  return lines.join('\n')
}

function buildIntentSummaryPromptBlock(intent: StackIntent): string {
  return [
    `- Auth required: ${intent.requires.auth ? 'yes' : 'no'}`,
    `- Database required: ${intent.requires.database ? 'yes' : 'no'}`,
    `- Deployment required: ${intent.requires.deployment ? 'yes' : 'no'}`,
    `- External API likely required: ${intent.requires.externalApi ? 'yes' : 'no'}`,
    `- AI API required: ${intent.requires.aiApi ? 'yes' : 'no'}`,
    `- Complexity: ${intent.complexity} (max ${intent.maxPrimaryTools} tools in Best first version)`,
  ].join('\n')
}

export function buildSystemPrompt(opts: {
  mode?: string
  context?: ChatContext
  stackIntent?: StackIntent
  stackPlan?: StackPlan
}): string {
  if (opts.mode === 'suggest-stack') {
    const intent = opts.stackIntent
    const stackPlan = opts.stackPlan

    if (!intent || !stackPlan) {
      return [
        'You suggest minimal stacks for vibe coders.',
        'Keep recommendations concise and practical.',
      ].join('\n')
    }

    return [
      'You are a stack advisor for vibe coders (AI-assisted coding, minimal config, ship fast).',
      'Recommend the minimum viable build path for this specific app idea.',
      'Speak like a pragmatic AI pair programmer, not a framework tutorial.',
      'Do NOT recommend a tool from every guide section by default.',
      '',
      'Intent analysis from backend policy (treat as hard constraints):',
      buildIntentSummaryPromptBlock(intent),
      '',
      'Candidate tools (prefer these when relevant):',
      buildCandidateToolsPromptBlock(stackPlan),
      '',
      'Output style:',
      '- Start with one short recommendation sentence.',
      '- Then provide 2 to 4 concise bullets total.',
      '- First bullet must start with: Start with **<development tool>** - <why this fits>.',
      '- Pick the development tool that best fits the request. Do not force a default tool.',
      '- Mention at most one supporting tool unless required by intent.',
      '- Add an external data/API bullet only when External API required is yes.',
      '- If relevant, add one bullet that starts with: Later if needed: ...',
      '',
      'Hard rules:',
      '- Never include auth tools in primary recommendation unless Auth required is yes.',
      '- Never include database tools in primary recommendation unless Database required is yes.',
      '- Keep primary recommended guide tools within the max tool cap from intent analysis.',
      '- Never mention low-level implementation details: HTML/CSS/JavaScript steps, file creation, boilerplate, folder structure, or build config.',
      '- Keep language high-level, agentic, and beginner-friendly for vibe coders.',
      '- No [Guide] or [Other] labels.',
    ].join('\n')
  }

  if (opts.context) {
    return `The user is asking about ${opts.context.toolName}. Use this description: ${opts.context.toolDescription}. Answer their question concisely.`
  }

  return DEFAULT_SYSTEM_PROMPT
}

export function getModelForMode(mode?: string): string {
  return mode === 'suggest-stack' ? 'gpt-4o' : 'gpt-4o-mini'
}

function includesNormalizedPhrase(haystack: string, phrase: string): boolean {
  const normalizedPhrase = normalizeText(phrase)
  if (!normalizedPhrase) return false
  return haystack.includes(` ${normalizedPhrase} `)
}

export function extractMentionedGuideTools(content: string): string[] {
  const haystack = ` ${normalizeText(content)} `
  const mentioned = new Set<string>()

  for (const tool of GUIDE_TOOLS) {
    if (includesNormalizedPhrase(haystack, tool.name)) {
      mentioned.add(tool.name)
      continue
    }

    for (const alias of tool.aliases) {
      if (includesNormalizedPhrase(haystack, alias)) {
        mentioned.add(tool.name)
        break
      }
    }
  }

  return Array.from(mentioned)
}

function getMentionedToolsByCategory(toolNames: string[]): Record<SectionCategory, string[]> {
  const categorized: Record<SectionCategory, string[]> = {
    development: [],
    database: [],
    auth: [],
    deployment: [],
    terminal: [],
    api: [],
    other: [],
  }

  for (const toolName of toolNames) {
    const tool = GUIDE_TOOL_BY_NAME.get(toolName)
    if (!tool) continue
    categorized[tool.category].push(tool.name)
  }

  return categorized
}

function extractBulletLines(section: string): string[] {
  return section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
}

function extractPrimaryToolNames(content: string): string[] {
  const bulletLines = extractBulletLines(content).filter((line) => !/^[-*]\s*later if needed\b/i.test(line))
  const seen = new Set<string>()
  const orderedNames: string[] = []

  for (const line of bulletLines) {
    const lineTools = extractMentionedGuideTools(line)
    for (const toolName of lineTools) {
      if (!seen.has(toolName)) {
        seen.add(toolName)
        orderedNames.push(toolName)
      }
    }
  }

  return orderedNames
}

function hasLowLevelDetails(content: string): boolean {
  return LOW_LEVEL_DETAIL_PATTERNS.some((pattern) => pattern.test(content))
}

export function validateSuggestStackResponse(content: string, intent: StackIntent): SuggestValidation {
  const mentionedToolNames = extractMentionedGuideTools(content)
  const mentionedByCategory = getMentionedToolsByCategory(mentionedToolNames)
  const primaryToolNames = extractPrimaryToolNames(content)
  const bulletLines = extractBulletLines(content)

  const firstBullet = bulletLines[0] ?? ''
  const firstBulletStartsWithStartWith = /^[-*]\s*start with\b/i.test(firstBullet)
  const firstBulletToolNames = extractMentionedGuideTools(firstBullet)
  const firstBulletHasDevelopmentTool = firstBulletToolNames.some(
    (toolName) => GUIDE_TOOL_BY_NAME.get(toolName)?.category === 'development'
  )

  const missingDevelopmentTool =
    !firstBulletStartsWithStartWith ||
    !firstBulletHasDevelopmentTool ||
    mentionedByCategory.development.length === 0
  const unneededAuth = !intent.requires.auth && mentionedByCategory.auth.length > 0
  const unneededDatabase = !intent.requires.database && mentionedByCategory.database.length > 0
  const tooManyTools = primaryToolNames.length > intent.maxPrimaryTools
  const containsLowLevelDetails = hasLowLevelDetails(content)

  const wordCount = content.split(/\s+/).filter(Boolean).length
  const tooVerbose = bulletLines.length > 4 || wordCount > 140

  const details: string[] = []

  if (missingDevelopmentTool) {
    details.push(
      'First bullet must start with "Start with **<development tool>**" and include one development tool.'
    )
  }
  if (unneededAuth) {
    details.push('Remove auth tools unless user intent clearly requires user accounts.')
  }
  if (unneededDatabase) {
    details.push('Remove database tools unless user intent clearly requires saved data.')
  }
  if (tooManyTools) {
    details.push(`Keep the primary stack to at most ${intent.maxPrimaryTools} guide tools.`)
  }
  if (containsLowLevelDetails) {
    details.push(
      'Remove low-level implementation details (HTML/CSS/JavaScript/file setup/config) and keep coaching high-level.'
    )
  }
  if (tooVerbose) {
    details.push('Keep the answer concise: one short sentence plus up to four bullets.')
  }

  const violations: PolicyViolations = {
    missingDevelopmentTool,
    unneededAuth,
    unneededDatabase,
    tooManyTools,
    containsLowLevelDetails,
    tooVerbose,
    details,
  }

  return {
    isValid: details.length === 0,
    mentionedToolNames,
    primaryToolNames,
    violations,
  }
}

function buildCorrectionPrompt(params: {
  intent: StackIntent
  stackPlan: StackPlan
  violations: PolicyViolations
}): string {
  const violationSummary = params.violations.details.join(' ')

  return [
    'Rewrite your previous answer in a vibe-coder coaching style.',
    violationSummary,
    `Start with one development tool in the first bullet using: Start with **<tool>** - ...`,
    `Keep the stack minimal for ${params.intent.complexity} scope (max ${params.intent.maxPrimaryTools} guide tools).`,
    `Auth required: ${params.intent.requires.auth ? 'yes' : 'no'}. Include auth tools only if required.`,
    `Database required: ${params.intent.requires.database ? 'yes' : 'no'}. Include database tools only if required.`,
    `External API required: ${params.intent.requires.externalApi ? 'yes' : 'no'}.`,
    'Do not include low-level implementation details (HTML/CSS/JavaScript/files/boilerplate/config).',
    'Keep it to one short recommendation sentence and 2-4 concise bullets.',
    buildCandidateToolsPromptBlock(params.stackPlan),
    'No [Guide] or [Other] labels.',
  ].join('\n')
}

function buildFallbackSupportReason(tool: GuideTool): string {
  if (tool.category === 'database') return 'saved data'
  if (tool.category === 'auth') return 'user accounts'
  if (tool.category === 'deployment') return 'a public share link'
  if (tool.category === 'api') return 'AI features'
  return tool.sectionTitle.toLowerCase()
}

function buildDataSourceHint(latestUserMessage: string): string {
  if (/grocery|store|prices?/i.test(latestUserMessage)) {
    return 'Use one grocery or retail pricing API first, then add more store sources after the MVP works.'
  }

  if (/weather/i.test(latestUserMessage)) {
    return 'Use one weather API first so your first version stays easy to test and iterate.'
  }

  if (/stock|market/i.test(latestUserMessage)) {
    return 'Use one market-data API first and expand providers later.'
  }

  return 'Use one reliable external API provider first, then expand once the core flow is working.'
}

function joinWithAnd(values: string[]): string {
  if (values.length <= 1) return values[0] || ''
  if (values.length === 2) return `${values[0]} and ${values[1]}`
  return `${values.slice(0, -1).join(', ')}, and ${values[values.length - 1]}`
}

export function buildFallbackSuggestStackResponse(params: {
  intent: StackIntent
  stackPlan: StackPlan
  latestUserMessage: string
}): string {
  const rankedFallbackTools = getFallbackRankedTools()
  const developmentTool =
    params.stackPlan.primaryTools.find((tool) => tool.category === 'development') ||
    rankedFallbackTools.find((tool) => tool.category === 'development')

  if (!developmentTool) {
    return [
      'Start with one development tool and keep the first version tight.',
      '- Start with **your preferred development tool** - ask it to build one usable first version end-to-end.',
      '- Keep scope to one core user flow, then expand only after it works.',
    ].join('\n')
  }

  const primarySupportTools = params.stackPlan.primaryTools
    .filter((tool) => tool.id !== developmentTool.id)
    .filter((tool) => {
      if (tool.category === 'auth') return params.intent.requires.auth
      if (tool.category === 'database') return params.intent.requires.database
      if (tool.category === 'deployment') return params.intent.requires.deployment
      if (tool.category === 'api') return params.intent.requires.aiApi
      return false
    })
    .slice(0, Math.max(0, params.intent.maxPrimaryTools - 1))

  const bulletLines: string[] = []
  bulletLines.push(
    `- Start with **${developmentTool.name}** - ${developmentTool.tagline}. Use it to ship a usable first version quickly.`
  )

  if (primarySupportTools.length > 0) {
    const supportPhrases = primarySupportTools.map(
      (tool) => `**${tool.name}** for ${buildFallbackSupportReason(tool)}`
    )
    bulletLines.push(`- Add ${joinWithAnd(supportPhrases)} because this idea needs it in v1.`)
  }

  if (params.intent.requires.externalApi) {
    bulletLines.push(`- Data source: ${buildDataSourceHint(params.latestUserMessage)}`)
  }

  if (bulletLines.length < 2) {
    bulletLines.push('- Keep v1 focused on one core flow first, then add features only after that works.')
  }

  if (bulletLines.length < 4 && params.stackPlan.addLaterTools.length > 0) {
    const deferred = params.stackPlan.addLaterTools[0]
    bulletLines.push(`- Later if needed: **${deferred.name}** for ${buildFallbackSupportReason(deferred)}.`)
  }

  return [
    'Keep the first version lean so you can test the idea fast.',
    ...bulletLines.slice(0, 4),
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
}): Promise<
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; status: number; error: string }
> {
  try {
    const response = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      },
      body: JSON.stringify({
        model: params.model,
        messages: params.messages,
      }),
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

function filterToGuideTools(names: string[]): string[] {
  return names.filter((name) => GUIDE_TOOL_NAMES.has(name))
}

function summarizeSelectedSections(tools: GuideTool[]): string[] {
  return Array.from(new Set(tools.map((tool) => tool.sectionTitle)))
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

  let stackIntent: StackIntent | undefined
  let stackPlan: StackPlan | undefined

  if (body.mode === 'suggest-stack') {
    stackIntent = inferStackIntent(latestUserMessage, sanitizedMessages)

    logDebug('intent_inferred', {
      complexity: stackIntent.complexity,
      complexityScore: stackIntent.complexityScore,
      maxPrimaryTools: stackIntent.maxPrimaryTools,
      requires: stackIntent.requires,
      ambiguous: stackIntent.ambiguous,
      confidence: stackIntent.confidence,
      alreadyAskedClarifyingQuestion: stackIntent.alreadyAskedClarifyingQuestion,
      shouldAskClarifyingQuestion: stackIntent.shouldAskClarifyingQuestion,
    })

    if (stackIntent.shouldAskClarifyingQuestion) {
      logDebug('clarifying_question_returned', {
        ambiguous: stackIntent.ambiguous,
      })

      return {
        status: 200,
        json: buildCompletion({
          id: 'chatcmpl-clarify',
          model,
          content: CLARIFYING_QUESTION,
        }),
      }
    }

    stackPlan = buildStackPlan(stackIntent, latestUserMessage)
  }

  const systemPrompt = buildSystemPrompt({
    mode: body.mode,
    context: body.context,
    stackIntent,
    stackPlan,
  })

  const baseMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: systemPrompt },
    ...sanitizedMessages,
  ]

  logDebug('request_start', {
    mode: body.mode || 'default',
    model,
    messageCount: sanitizedMessages.length,
    selectedSections: summarizeSelectedSections(stackPlan?.primaryTools ?? []),
    selectedTools: (stackPlan?.primaryTools ?? []).map((tool) => tool.name),
  })

  const firstAttempt = await fetchChatCompletion({
    apiKey,
    model,
    messages: baseMessages,
  })

  if (!firstAttempt.ok) {
    logDebug('first_attempt_error', {
      mode: body.mode || 'default',
      status: firstAttempt.status,
    })

    return { status: firstAttempt.status, json: { error: firstAttempt.error } }
  }

  if (body.mode !== 'suggest-stack' || !stackIntent || !stackPlan) {
    return { status: 200, json: firstAttempt.data }
  }

  const firstContent = getAssistantContent(firstAttempt.data)
  const firstValidation = validateSuggestStackResponse(firstContent, stackIntent)

  logDebug('validation_first', {
    valid: firstValidation.isValid,
    mentionedGuideTools: filterToGuideTools(firstValidation.mentionedToolNames),
    primaryTools: filterToGuideTools(firstValidation.primaryToolNames),
    violations: firstValidation.violations.details,
  })

  if (firstValidation.isValid) {
    return { status: 200, json: firstAttempt.data }
  }

  const retryMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [...baseMessages]

  if (firstContent) {
    retryMessages.push({ role: 'assistant', content: firstContent })
  }

  retryMessages.push({
    role: 'user',
    content: buildCorrectionPrompt({
      intent: stackIntent,
      stackPlan,
      violations: firstValidation.violations,
    }),
  })

  const secondAttempt = await fetchChatCompletion({
    apiKey,
    model,
    messages: retryMessages,
  })

  if (secondAttempt.ok) {
    const secondContent = getAssistantContent(secondAttempt.data)
    const secondValidation = validateSuggestStackResponse(secondContent, stackIntent)

    logDebug('validation_retry', {
      valid: secondValidation.isValid,
      mentionedGuideTools: filterToGuideTools(secondValidation.mentionedToolNames),
      primaryTools: filterToGuideTools(secondValidation.primaryToolNames),
      violations: secondValidation.violations.details,
      retryUsed: true,
    })

    if (secondValidation.isValid) {
      return { status: 200, json: secondAttempt.data }
    }
  } else {
    logDebug('retry_attempt_error', {
      status: secondAttempt.status,
      retryUsed: true,
    })
  }

  const fallbackContent = buildFallbackSuggestStackResponse({
    intent: stackIntent,
    stackPlan,
    latestUserMessage,
  })

  logDebug('fallback_used', {
    retryUsed: true,
    selectedSections: summarizeSelectedSections(stackPlan.primaryTools),
    selectedTools: stackPlan.primaryTools.map((tool) => tool.name),
  })

  return {
    status: 200,
    json: buildCompletion({ model, content: fallbackContent }),
  }
}
