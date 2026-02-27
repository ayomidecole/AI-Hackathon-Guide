// src/content/sections.ts
var sections = [
  {
    id: "dev-tools",
    title: "Development tools",
    tools: [
      {
        id: "cursor",
        name: "Cursor",
        tagline: "AI-first code editor",
        description: "Built to make you extraordinarily productive, Cursor is the best way to code with AI.",
        bullets: ["Pair programming", "Inline edits", "Agent mode"],
        url: "https://cursor.com",
        detailsGuide: {
          label: "Best practices for coding with agents",
          url: "https://cursor.com/blog/agent-best-practices"
        },
        detailsVideo: {
          title: "Watch: Cursor walkthrough",
          embedUrl: "https://www.youtube.com/embed/WVeYLlKOWc0",
          watchUrl: "https://youtu.be/WVeYLlKOWc0?si=fo3YBV_dynf_HuXj"
        },
        detailsSections: [
          {
            heading: "Start with plans",
            items: [
              "Use Plan Mode (Shift+Tab): the agent researches your codebase, asks clarifying questions, and creates a plan before writing code.",
              "If the agent goes off track, revert and refine the plan instead of fixing via follow-ups\u2014often faster and cleaner."
            ]
          },
          {
            heading: "Context",
            items: [
              `Let the agent find context; you don't need to tag every file. Use @Branch for "what am I working on?" and @Past Chats to reference previous conversations.`,
              "Start a new conversation when switching tasks or when the agent loses focus; long threads add noise."
            ]
          },
          {
            heading: "Rules & skills",
            items: [
              "Rules (.cursor/rules/): always-on context (commands, code style, workflow). Keep them short; reference files instead of copying them.",
              "Skills (SKILL.md): custom commands, hooks, and domain knowledge the agent loads when relevant."
            ]
          },
          {
            heading: "Workflows",
            items: [
              "TDD: ask for tests \u2192 run and confirm they fail \u2192 commit \u2192 ask for implementation that passes \u2192 iterate until green.",
              "Use /commands for repeatable workflows (e.g. /pr, /review). Store in .cursor/commands/ and commit to git."
            ]
          }
        ]
      },
      {
        id: "codex",
        name: "Codex",
        tagline: "AI coding agent for web and desktop",
        description: "Codex helps you plan, edit, and ship code faster. Use the web app for quick guidance and the desktop app for deep repo work with local files and terminal commands.",
        bullets: [
          "Web app for quick coding help",
          "Desktop app for repo-level execution",
          "Planning, implementation, and review"
        ],
        url: "https://chatgpt.com",
        detailsGuide: {
          label: "OpenAI developer docs",
          url: "https://platform.openai.com/docs/overview"
        },
        detailsVideo: {
          title: "Watch: Codex walkthrough",
          embedUrl: "https://www.youtube.com/embed/HFM3se4lNiw",
          watchUrl: "https://www.youtube.com/watch?v=HFM3se4lNiw"
        },
        detailsSections: [
          {
            heading: "Web app vs desktop app",
            items: [
              "Use the Codex web app for fast ideation: architecture questions, debugging help, API examples, and implementation plans when you are away from your local environment.",
              "Use the Codex desktop app when you need execution: reading and editing repo files, running terminal commands, applying patches, and validating changes in the actual project workspace."
            ]
          },
          {
            heading: "Hackathon workflow",
            items: [
              "Start in the web app to shape the MVP scope, pick the stack, and outline milestones.",
              "Move to the desktop app to implement features end-to-end, run checks, and iterate on real code quickly."
            ]
          },
          {
            heading: "Prompting tips",
            items: [
              "Give concrete constraints: framework, target file paths, expected API behavior, and acceptance criteria.",
              "Ask for small, testable increments and request verification steps after each change to keep delivery reliable."
            ]
          }
        ]
      },
      {
        id: "replit",
        name: "Replit",
        tagline: "Browser-based IDE",
        description: "Run full-stack apps in the cloud with zero setup. Collaborate in real-time.",
        bullets: [
          "Cloud development",
          "Real-time collaboration",
          "Deploy instantly"
        ],
        url: "https://replit.com",
        detailsGuide: {
          label: "Effective prompting with Replit AI",
          url: "https://docs.replit.com/tutorials/effective-prompting"
        },
        detailsVideo: {
          title: "Watch: Replit walkthrough",
          embedUrl: "https://www.youtube.com/embed/IPQxZ42omZY",
          watchUrl: "https://www.youtube.com/watch?v=IPQxZ42omZY"
        },
        detailsSections: [
          {
            heading: "Getting started",
            items: [
              "Create a Repl from a template (Node, Python, etc.) and start coding instantly\u2014no local setup.",
              "Use Replit AI Agent: plan first, be specific with instructions, build incrementally."
            ]
          },
          {
            heading: "Collaboration & deploy",
            items: [
              "Invite teammates to your Repl for real-time pair programming\u2014great for hackathon teams.",
              "Deploy with one click; use Replit Secrets for API keys instead of hardcoding."
            ]
          },
          {
            heading: "Security checklist",
            items: [
              "Use Replit Auth for authentication; validate user input; secure API endpoints with rate limiting.",
              "Never commit secrets\u2014use the Secrets manager and keep credentials out of version control."
            ]
          }
        ]
      },
      {
        id: "claude-code",
        name: "Claude Code",
        tagline: "Anthropic's coding assistant",
        description: "Advanced coding capabilities for generation, explanation, and refactoring.",
        bullets: [
          "Code generation",
          "Deep explanation",
          "Refactoring support"
        ],
        url: "https://claude.ai",
        detailsGuide: {
          label: "Claude for developers",
          url: "https://docs.anthropic.com/en/docs/build-with-claude"
        },
        detailsVideo: {
          title: "Watch: Claude Code walkthrough",
          embedUrl: "https://www.youtube.com/embed/AJpK3YTTKZ4",
          watchUrl: "https://www.youtube.com/watch?v=AJpK3YTTKZ4"
        },
        detailsSections: [
          {
            heading: "Prompting effectively",
            items: [
              "Be specific about context (file paths, tech stack) and desired output format.",
              "Ask for explanations when debugging; Claude excels at walking through code step-by-step."
            ]
          },
          {
            heading: "Hackathon workflows",
            items: [
              "Use for rapid prototyping: describe the feature, get a first pass, then iterate.",
              "Refactoring: paste messy code, ask for cleanup or optimization before submission."
            ]
          },
          {
            heading: "Integration",
            items: [
              "Claude Code works in Claude\u2019s interface; pair with Cursor or Replit for full IDE integration.",
              "Use for brainstorming architecture or API design before implementing."
            ]
          }
        ]
      },
      {
        id: "lovable",
        name: "Lovable",
        tagline: "AI-powered app builder",
        description: "Turn prompts into full-stack web apps. Formerly GPT Engineer.",
        bullets: [
          "Design to code",
          "Prompt-based building",
          "Full-stack generation"
        ],
        url: "https://lovable.dev",
        detailsGuide: {
          label: "Lovable quick start",
          url: "https://docs.lovable.dev/introduction/getting-started"
        },
        detailsVideo: {
          title: "Watch: Lovable walkthrough",
          embedUrl: "https://www.youtube.com/embed/a20C3JLKnHE",
          watchUrl: "https://www.youtube.com/watch?v=a20C3JLKnHE&list=PLbVHz4urQBZn5BIXWemOZLw3620LF-VrE&index=1"
        },
        detailsSections: [
          {
            heading: "Prompting tips",
            items: [
              'Describe your app in one clear prompt: e.g. "Dashboard with login, monthly sales chart, and customer pie chart."',
              "Attach reference images for design; Lovable uses them to match your vision."
            ]
          },
          {
            heading: "Iterating quickly",
            items: [
              'Use chat to refine: "Add a dark mode toggle" or "Make the table sortable."',
              "Switch between edit mode (direct code changes) and chat mode (natural language) as needed."
            ]
          },
          {
            heading: "Hackathon flow",
            items: [
              "Generate the MVP from a prompt, then iterate in chat\u2014ideal for rapid prototyping.",
              "One-click deploy and GitHub sync; export code for final polish before judging."
            ]
          }
        ]
      }
    ]
  },
  {
    id: "databases",
    title: "Databases",
    tools: [
      {
        id: "supabase",
        name: "Supabase",
        tagline: "Open source Firebase alternative",
        description: "The open source Firebase alternative. Start your project with a Postgres database, Authentication, instant APIs, Edge Functions, Realtime subscriptions, and Storage.",
        bullets: [
          "Postgres database",
          "Authentication",
          "Realtime subscriptions"
        ],
        url: "https://supabase.com",
        detailsGuide: {
          label: "Supabase quickstart",
          url: "https://supabase.com/docs/guides/getting-started"
        },
        detailsVideo: {
          title: "Watch: Supabase setup for beginners",
          embedUrl: "https://www.youtube.com/embed/7uKQBl9uZ00",
          watchUrl: "https://www.youtube.com/watch?v=7uKQBl9uZ00"
        },
        detailsSections: [
          {
            heading: "Setup in minutes",
            items: [
              "Create a project at database.new; get Postgres, Auth, Storage, and auto-generated REST APIs.",
              "Use framework quickstarts (React, Next.js, etc.) to wire up the client in your stack."
            ]
          },
          {
            heading: "Auth & database",
            items: [
              "Row Level Security (RLS): define policies so users only access their own data.",
              "Auth: email, social logins, magic links\u2014configure providers in the dashboard."
            ]
          },
          {
            heading: "Hackathon tips",
            items: [
              "Rely on the Table Editor for schema changes during prototyping; add RLS before demo.",
              "Realtime subscriptions are great for live dashboards, chat, or collaborative features."
            ]
          }
        ]
      }
    ]
  },
  {
    id: "auth",
    title: "Auth",
    tools: [
      {
        id: "clerk",
        name: "Clerk",
        tagline: "User management for modern apps",
        description: "Drop-in components and APIs for authentication, user management, and session handling. Built for React and Next.js with a generous free tier.",
        bullets: [
          "Pre-built components",
          "Next.js & React",
          "Free tier"
        ],
        url: "https://clerk.com",
        detailsGuide: {
          label: "Clerk quickstart",
          url: "https://clerk.com/docs/quickstarts/nextjs"
        },
        detailsVideo: {
          title: "Watch: Clerk official setup walkthrough",
          embedUrl: "https://www.youtube.com/embed/fsuHLafTYyg",
          watchUrl: "https://www.youtube.com/watch?v=fsuHLafTYyg"
        },
        detailsSections: [
          {
            heading: "Quick setup",
            items: [
              "Install @clerk/nextjs, add env vars (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY), wrap your app in ClerkProvider.",
              "Use <SignIn /> and <SignUp /> for pre-built modals, or <UserButton /> for profile dropdown."
            ]
          },
          {
            heading: "Protecting routes",
            items: [
              "Use middleware to protect routes: export default clerkMiddleware((auth, req) => { ... }).",
              "Get the current user with auth() in server components or useUser() in client components."
            ]
          },
          {
            heading: "Hackathon tips",
            items: [
              "Social logins (Google, GitHub) work out of the box\u2014fast for demos.",
              "Free tier is generous; no credit card needed for most hackathon projects."
            ]
          }
        ]
      },
      {
        id: "auth0",
        name: "Auth0",
        tagline: "Identity platform",
        description: "Secure access for everyone. Add authentication and authorization to your apps with social logins, SSO, and MFA.",
        bullets: [
          "Social & enterprise login",
          "SSO & MFA",
          "Universal Login"
        ],
        url: "https://auth0.com",
        detailsGuide: {
          label: "Auth0 quickstart",
          url: "https://auth0.com/docs/quickstart"
        },
        detailsVideo: {
          title: "Watch: Auth0 official React quickstart playlist",
          embedUrl: "https://www.youtube.com/embed/videoseries?list=PLZ14qQz3cfJL6aoKZ_Ly7jiYrwi9ihviW",
          watchUrl: "https://www.youtube.com/playlist?list=PLZ14qQz3cfJL6aoKZ_Ly7jiYrwi9ihviW"
        },
        detailsSections: [
          {
            heading: "Setup",
            items: [
              "Create a tenant at auth0.com, add an Application (SPA or Regular Web), configure callback URLs.",
              "Use Auth0 React SDK or Next.js SDK for minimal setup; Universal Login handles the UI."
            ]
          },
          {
            heading: "Social & features",
            items: [
              "Enable Google, GitHub, etc. in the Dashboard \u2192 Authentication \u2192 Social.",
              "MFA and rules are available for production; skip for hackathon MVPs unless needed."
            ]
          },
          {
            heading: "Hackathon tips",
            items: [
              "Free tier includes 7,000 active users; enough for demos and judging.",
              "Use the hosted login page to avoid building your own UI\u2014focus on your app."
            ]
          }
        ]
      },
      {
        id: "nextauth",
        name: "NextAuth",
        tagline: "Auth for Next.js",
        description: "Authentication for Next.js and Serverless. Supports OAuth, email, credentials, and custom providers with a simple API.",
        bullets: [
          "OAuth & credentials",
          "Next.js native",
          "Open source"
        ],
        url: "https://next-auth.js.org",
        detailsGuide: {
          label: "NextAuth.js quickstart",
          url: "https://authjs.dev/getting-started/installation"
        },
        detailsVideo: {
          title: "Watch: NextAuth beginner setup (community)",
          embedUrl: "https://www.youtube.com/embed/NhBX6cTcTdI",
          watchUrl: "https://www.youtube.com/watch?v=NhBX6cTcTdI"
        },
        detailsSections: [
          {
            heading: "Setup",
            items: [
              "Install next-auth; create app/api/auth/[...nextauth]/route.ts and configure providers (Google, GitHub, etc.).",
              "Add NEXTAUTH_URL and provider client IDs/secrets to .env; wrap the app in SessionProvider."
            ]
          },
          {
            heading: "Usage",
            items: [
              "Use getServerSession() in server components or useSession() in client components.",
              "Protect API routes by checking the session; redirect unauthenticated users as needed."
            ]
          },
          {
            heading: "Hackathon tips",
            items: [
              "OAuth providers are quick to add; no custom UI required.",
              "Open source and self-hosted\u2014no vendor lock-in, great for open-source projects."
            ]
          }
        ]
      }
    ]
  },
  {
    id: "deployment",
    title: "Deployment",
    tools: [
      {
        id: "netlify",
        name: "Netlify",
        tagline: "Static sites + serverless",
        description: "The fastest way to build the fastest sites. Git-based deploy, previews, and edge functions.",
        bullets: [
          "Git-based deployment",
          "Deploy previews",
          "Edge functions"
        ],
        url: "https://netlify.com",
        detailsGuide: {
          label: "Netlify deploy guide",
          url: "https://docs.netlify.com/site-deploys/create-deploys/"
        },
        detailsVideo: {
          title: "Watch: Netlify official deployment intro",
          embedUrl: "https://www.youtube.com/embed/wWZGjddjUlw",
          watchUrl: "https://www.youtube.com/watch?v=wWZGjddjUlw"
        },
        detailsSections: [
          {
            heading: "Deploy from Git",
            items: [
              "Connect a repo; Netlify auto-builds on push. Set build command (e.g. npm run build) and publish directory (e.g. dist or out).",
              "Each PR gets a unique preview URL\u2014perfect for sharing demos with judges."
            ]
          },
          {
            heading: "Environment & functions",
            items: [
              "Add env vars in Site settings \u2192 Environment variables; use Netlify Functions for serverless APIs.",
              "Functions live in netlify/functions/; use any Node or Go runtime."
            ]
          },
          {
            heading: "Hackathon tips",
            items: [
              "Drag-and-drop deploy is fastest for static sites; use Git for automatic updates.",
              "Free tier includes 300 build minutes/month and 100GB bandwidth\u2014usually enough."
            ]
          }
        ]
      },
      {
        id: "vercel",
        name: "Vercel",
        tagline: "Frontend/Next.js deployment",
        description: "Develop. Preview. Ship. The platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.",
        bullets: [
          "Next.js optimization",
          "Serverless functions",
          "Global edge network"
        ],
        url: "https://vercel.com",
        detailsGuide: {
          label: "Vercel deployment",
          url: "https://vercel.com/docs/deployments/overview"
        },
        detailsVideo: {
          title: "Watch: Vercel deployment walkthrough",
          embedUrl: "https://www.youtube.com/embed/sPmat30SE4k",
          watchUrl: "https://www.youtube.com/watch?v=sPmat30SE4k"
        },
        detailsSections: [
          {
            heading: "Deploy",
            items: [
              "Import a Git repo; Vercel detects Next.js, React, etc. and sets build config automatically.",
              "Every push creates a preview URL; production deploys from the main branch."
            ]
          },
          {
            heading: "Serverless & env",
            items: [
              "API routes in pages/api/ or app/api/ become serverless functions with zero config.",
              "Add env vars in Project Settings; use VERCEL_ENV for preview vs production."
            ]
          },
          {
            heading: "Hackathon tips",
            items: [
              "Next.js is first-class\u2014edge, ISR, and streaming work out of the box.",
              "Preview URLs are ideal for sharing with teammates and judges before merge."
            ]
          }
        ]
      },
      {
        id: "railway",
        name: "Railway",
        tagline: "Simple app hosting",
        description: "Railway is an infrastructure platform where you can provision infrastructure, develop with that infrastructure locally, and then deploy to the cloud.",
        bullets: ["Zero config", "Cron jobs", "Database provisioning"],
        url: "https://railway.app",
        detailsGuide: {
          label: "Railway docs",
          url: "https://docs.railway.app/"
        },
        detailsVideo: {
          title: "Watch: Railway beginner deploy flow (community)",
          embedUrl: "https://www.youtube.com/embed/1sUWXpkxpq8",
          watchUrl: "https://www.youtube.com/watch?v=1sUWXpkxpq8"
        },
        detailsSections: [
          {
            heading: "Deploy",
            items: [
              "Connect a repo or use railway up; Railway auto-detects frameworks (Node, Python, etc.).",
              "Add Postgres, Redis, or other services with one click; connection strings are injected automatically."
            ]
          },
          {
            heading: "Cron & background",
            items: [
              "Use cron jobs for scheduled tasks; define in railway.json or via the dashboard.",
              "Run workers and APIs in the same project; scale by adding more instances."
            ]
          },
          {
            heading: "Hackathon tips",
            items: [
              "Free tier ($5 credit) is enough for demos; upgrade if you need more resources.",
              "Database provisioning is fast\u2014add Postgres in seconds and connect with one env var."
            ]
          }
        ]
      }
    ]
  },
  {
    id: "terminal",
    title: "Terminal",
    tools: [
      {
        id: "warp",
        name: "Warp",
        tagline: "Modern terminal",
        description: "Warp is a blazingly fast, Rust-based terminal reimagined from the ground up to work like a modern app.",
        bullets: [
          "AI command search",
          "Block-based output",
          "Collaborative workflows"
        ],
        url: "https://warp.dev",
        detailsGuide: {
          label: "Warp docs",
          url: "https://docs.warp.dev/"
        },
        detailsVideo: {
          title: "Watch: Warp terminal intro (community)",
          embedUrl: "https://www.youtube.com/embed/gBdehHrtb94",
          watchUrl: "https://www.youtube.com/watch?v=gBdehHrtb94"
        },
        detailsSections: [
          {
            heading: "AI & productivity",
            items: [
              "Use Ctrl+` or Cmd+` to open the AI command palette; ask for commands or explanations.",
              "Block-based output: each command and its output are grouped for easy scrolling and selection."
            ]
          },
          {
            heading: "Workflows",
            items: [
              "Workflows: save and replay command sequences (e.g. build, test, deploy) for repeatability.",
              "Split panes and tabs for running multiple processes (dev server, tests, logs) side by side."
            ]
          },
          {
            heading: "Hackathon tips",
            items: [
              "AI command search helps when you forget syntax or need to debug shell errors quickly.",
              "Use workflows to standardize setup across your team (git clone, npm install, env setup)."
            ]
          }
        ]
      }
    ]
  },
  {
    id: "apis",
    title: "APIs",
    tools: [
      {
        id: "openai",
        name: "OpenAI API",
        tagline: "AI models for your app",
        description: "Access GPT-4 and other models for chat, completions, and embeddings to build AI-powered features.",
        bullets: ["GPT-4 access", "Embeddings", "Fine-tuning"],
        url: "https://platform.openai.com",
        detailsGuide: {
          label: "OpenAI API quickstart",
          url: "https://platform.openai.com/docs/quickstart"
        },
        detailsVideo: {
          title: "Watch: OpenAI Responses API intro (community)",
          embedUrl: "https://www.youtube.com/embed/S2lUjCT0UXY",
          watchUrl: "https://www.youtube.com/watch?v=S2lUjCT0UXY"
        },
        detailsSections: [
          {
            heading: "Setup",
            items: [
              "Create an API key at platform.openai.com; store it in env vars (e.g. OPENAI_API_KEY)\u2014never commit it.",
              "Use the Chat Completions API for conversational AI; Structured Outputs for reliable JSON."
            ]
          },
          {
            heading: "Models & usage",
            items: [
              "gpt-4o is fast and capable for most use cases; gpt-4o-mini is cheaper for high-volume tasks.",
              "Embeddings (text-embedding-3-small) for search, RAG, and similarity\u2014key for hackathon demos."
            ]
          },
          {
            heading: "Hackathon tips",
            items: [
              "Free tier credits are limited; monitor usage and switch to mini for non-critical calls.",
              "Use system prompts to define behavior; few-shot examples improve consistency for demos."
            ]
          }
        ]
      }
    ]
  }
];

// shared/chatPolicy.ts
var DEFAULT_SYSTEM_PROMPT = "You are an assistant for the AI Hackathon Guide. Help users find tools, compare options (e.g. Cursor vs Replit), and get quick tips for building AI apps during hackathons. Be concise and actionable.";
var OPENAI_CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";
var SECTION_TO_CATEGORY = {
  "development tools": "development",
  databases: "database",
  auth: "auth",
  deployment: "deployment",
  terminal: "terminal",
  apis: "api"
};
function normalizeText(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function tokenize(value) {
  return normalizeText(value).split(" ").filter((token) => token.length >= 3);
}
function getSectionCategory(sectionTitle) {
  const normalized = normalizeText(sectionTitle);
  return SECTION_TO_CATEGORY[normalized] ?? "other";
}
function buildToolAliases(toolId, toolName) {
  const aliases = /* @__PURE__ */ new Set([toolName]);
  if (toolId === "openai") {
    aliases.add("openai");
    aliases.add("openai api");
  }
  if (toolId === "nextauth") {
    aliases.add("nextauth");
    aliases.add("next auth");
    aliases.add("authjs");
    aliases.add("auth js");
  }
  if (toolId === "claude-code") {
    aliases.add("claude");
    aliases.add("claude code");
  }
  return Array.from(aliases);
}
var GUIDE_TOOLS = sections.flatMap(
  (section) => section.tools.map((tool) => ({
    id: tool.id,
    name: tool.name,
    tagline: tool.tagline,
    description: tool.description,
    sectionTitle: section.title,
    category: getSectionCategory(section.title),
    normalizedName: normalizeText(tool.name),
    searchText: normalizeText(
      [tool.name, tool.tagline, tool.description, ...tool.bullets, section.title].join(" ")
    ),
    aliases: buildToolAliases(tool.id, tool.name)
  }))
);
function getSuggestStackToolList() {
  return sections.flatMap(
    (section) => section.tools.map((tool) => ({
      name: tool.name,
      category: getSectionCategory(section.title),
      tagline: tool.tagline
    }))
  );
}
function buildSuggestStackSystemPrompt(tools) {
  const toolListText = tools.map((t) => `- ${t.name} (${t.category}): ${t.tagline}`).join("\n");
  return [
    "You are a stack advisor for vibe coders. A vibe coder will NOT read or write code; they use AI coding agents (e.g. Cursor, Codex) and product dashboards/UIs only. Your recommendations must assume the user never touches code.",
    "",
    "Reason about the user's idea: do they need auth (multi-user vs single-user), persistence (saved data vs ephemeral), external APIs, AI/LLM features, or deployment? Recommend a minimal stack that matches.",
    "",
    "Guide tools (prefer these when they fit; suggest a non-Guide tool only when clearly better for a non-coder):",
    toolListText,
    "",
    "Respond with valid JSON only. No markdown, no code fence. Use exactly one of these shapes:",
    "",
    'If you need one clarifying question that would change the stack, use: {"kind":"clarification","clarifying_question":"Your single short question here","stack":null}',
    "",
    'Otherwise use: {"kind":"stack","clarifying_question":null,"stack":{"summary":"One short sentence.","dev_tool":"Tool name","core_tools":[{"name":"...","category":"auth|database|api|deployment|other","reason":"Why this fits a non-coder."}],"optional_later":[{"name":"...","category":"...","reason":"Why later."}],"setup_note":"Short concrete steps: install/open X, ask your agent to\u2026 or use dashboard to\u2026 Only agent + dashboard steps, no code."}}',
    "",
    "Rules:",
    "- Minimal stack: 1 dev_tool + up to a few core_tools, 0\u20132 optional_later.",
    "- At most one clarifying question; only if the answer materially changes the stack.",
    '- setup_note and reasons must only describe agent/dashboard steps. Never say "write code", "implement X in React", "create a Spring Boot app". Say "open your AI dev tool and ask it to\u2026" or "use the X dashboard to\u2026".',
    "- Keep language high-level and beginner-friendly."
  ].join("\n");
}
function getFallbackRankedTools() {
  return [...GUIDE_TOOLS];
}
function rankGuideToolsByQuery(query, limit = 20) {
  const queryNormalized = normalizeText(query);
  const queryTokens = tokenize(query);
  const scored = GUIDE_TOOLS.map((tool, index) => {
    let score = 0;
    if (queryNormalized.includes(tool.normalizedName)) {
      score += 10;
    }
    for (const token of queryTokens) {
      if (tool.normalizedName.includes(token)) {
        score += 3;
      }
      if (tool.searchText.includes(token)) {
        score += 1;
      }
    }
    return { tool, score, index };
  });
  const ranked = scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.index - b.index;
  }).map((entry) => entry.tool);
  if (!scored.some((entry) => entry.score > 0)) {
    return getFallbackRankedTools().slice(0, limit);
  }
  return ranked.slice(0, limit);
}
function sanitizeMessages(messages) {
  return messages.filter((message) => message && typeof message.content === "string").map((message) => ({ role: message.role, content: message.content.trim() })).filter((message) => Boolean(message.content)).filter(
    (message) => message.role === "user" || message.role === "assistant"
  );
}
function getLatestUserMessage(messages) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index].role === "user") {
      return messages[index].content;
    }
  }
  return messages[messages.length - 1]?.content ?? "";
}
function buildSystemPrompt(opts) {
  if (opts.context) {
    return `The user is asking about ${opts.context.toolName}. Use this description: ${opts.context.toolDescription}. Answer their question concisely.`;
  }
  return DEFAULT_SYSTEM_PROMPT;
}
function getModelForMode(mode) {
  return mode === "suggest-stack" ? "gpt-4o" : "gpt-4o-mini";
}
function formatSuggestStackMarkdown(stack) {
  const lines = [stack.summary, ""];
  lines.push(`- Start with **${stack.dev_tool}** \u2013 use it as your main AI dev environment to build the first version.`);
  for (const t of stack.core_tools) {
    lines.push(`- **${t.name}** (${t.category}): ${t.reason}`);
  }
  if (stack.optional_later.length > 0) {
    const later = stack.optional_later.map((t) => `${t.name} for ${t.reason}`).join("; ");
    lines.push(`- Later if needed: ${later}`);
  }
  lines.push(`- To get started: ${stack.setup_note}`);
  return lines.join("\n");
}
function buildSuggestStackFallbackResponse(latestUserMessage) {
  const ranked = rankGuideToolsByQuery(latestUserMessage, 5);
  const devTool = ranked.find((t) => t.category === "development") ?? ranked[0];
  if (!devTool) {
    return [
      "Start with your preferred AI dev tool and ask it to build a minimal version of your idea.",
      "- Open Cursor, Codex, or Replit and describe what you want to build.",
      "- Keep the first version to one core flow; add more after it works."
    ].join("\n");
  }
  return [
    `Keep the first version lean. Start with **${devTool.name}** \u2013 ${devTool.tagline}.`,
    `- Open ${devTool.name} and ask it to build a minimal version of your idea.`,
    "- Use the agent for everything; no need to write code yourself.",
    "- Add a database or auth later only if you need saved data or user accounts."
  ].join("\n");
}
function buildCompletion(params) {
  return {
    id: params.id || "chatcmpl-fallback",
    object: "chat.completion",
    created: Math.floor(Date.now() / 1e3),
    model: params.model,
    choices: [
      {
        index: 0,
        finish_reason: "stop",
        message: {
          role: "assistant",
          content: params.content
        }
      }
    ]
  };
}
async function fetchChatCompletion(params) {
  try {
    const body = {
      model: params.model,
      messages: params.messages
    };
    if (params.response_format) {
      body.response_format = params.response_format;
    }
    const response = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.apiKey}`
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: data.error?.message || "OpenAI API error"
      };
    }
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      status: 500,
      error: "Internal server error"
    };
  }
}
function getAssistantContent(payload) {
  const choices = payload.choices;
  if (!Array.isArray(choices)) return "";
  const firstChoice = choices[0];
  return firstChoice?.message?.content?.trim() || "";
}
function shouldDebugLog() {
  return process.env.NODE_ENV !== "production";
}
function logDebug(event, data) {
  if (!shouldDebugLog()) return;
  console.info(`[chat-policy] ${event}`, data);
}
async function handleChatRequest(apiKey, body) {
  if (!apiKey) {
    return { status: 500, json: { error: "OPENAI_API_KEY is not configured" } };
  }
  if (!body?.messages || !Array.isArray(body.messages)) {
    return { status: 400, json: { error: "messages array is required" } };
  }
  const sanitizedMessages = sanitizeMessages(body.messages);
  if (sanitizedMessages.length === 0) {
    return { status: 400, json: { error: "messages array must contain user/assistant messages" } };
  }
  const latestUserMessage = getLatestUserMessage(sanitizedMessages);
  const model = getModelForMode(body.mode);
  if (body.mode === "suggest-stack") {
    const tools = getSuggestStackToolList();
    const systemPrompt2 = buildSuggestStackSystemPrompt(tools);
    const baseMessages2 = [
      { role: "system", content: systemPrompt2 },
      ...sanitizedMessages
    ];
    const result = await fetchChatCompletion({
      apiKey,
      model,
      messages: baseMessages2,
      response_format: { type: "json_object" }
    });
    if (!result.ok) {
      logDebug("suggest_stack_error", { status: result.status });
      return { status: result.status, json: { error: result.error } };
    }
    const content = getAssistantContent(result.data);
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      logDebug("suggest_stack_parse_failed", {});
      const fallbackContent2 = buildSuggestStackFallbackResponse(latestUserMessage);
      return { status: 200, json: buildCompletion({ model, content: fallbackContent2 }) };
    }
    if (parsed.kind === "clarification" && parsed.clarifying_question) {
      return {
        status: 200,
        json: buildCompletion({
          id: "chatcmpl-clarify",
          model,
          content: parsed.clarifying_question
        })
      };
    }
    if (parsed.kind === "stack" && parsed.stack) {
      const markdown = formatSuggestStackMarkdown(parsed.stack);
      return { status: 200, json: buildCompletion({ model, content: markdown }) };
    }
    const fallbackContent = buildSuggestStackFallbackResponse(latestUserMessage);
    return { status: 200, json: buildCompletion({ model, content: fallbackContent }) };
  }
  const systemPrompt = buildSystemPrompt({ mode: body.mode, context: body.context });
  const baseMessages = [
    { role: "system", content: systemPrompt },
    ...sanitizedMessages
  ];
  logDebug("request_start", {
    mode: body.mode || "default",
    model,
    messageCount: sanitizedMessages.length
  });
  const attempt = await fetchChatCompletion({
    apiKey,
    model,
    messages: baseMessages
  });
  if (!attempt.ok) {
    logDebug("first_attempt_error", {
      mode: body.mode || "default",
      status: attempt.status
    });
    return { status: attempt.status, json: { error: attempt.error } };
  }
  return { status: 200, json: attempt.data };
}

// server/chat.ts
async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const result = await handleChatRequest(
    process.env.OPENAI_API_KEY,
    req.body
  );
  res.status(result.status).json(result.json);
}
export {
  handler as default
};
