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
var REQUIRED_THRESHOLD = 0.65;
var AMBIGUOUS_THRESHOLD_MIN = 0.4;
var AMBIGUOUS_THRESHOLD_MAX = 0.64;
var CLARIFYING_QUESTION = "Do you need user accounts or saved data in the first version? If no, I'll keep it no-auth and no-database.";
var AUTH_POSITIVE_PATTERNS = [
  /\blogin\b/i,
  /\bsign[ -]?in\b/i,
  /\bsign[ -]?up\b/i,
  /\buser accounts?\b/i,
  /\baccounts?\b/i,
  /\bauth(?:entication)?\b/i,
  /\bsessions?\b/i,
  /\bpermissions?\b/i,
  /\bprofiles?\b/i
];
var AUTH_NEGATIVE_PATTERNS = [
  /\bno auth\b/i,
  /\bwithout auth\b/i,
  /\bno login\b/i,
  /\bwithout login\b/i,
  /\bno user accounts?\b/i,
  /\banonymous users?\b/i,
  /\bguest mode\b/i,
  /\bsingle user\b/i
];
var DATABASE_POSITIVE_PATTERNS = [
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
  /\bsync\b/i
];
var DATABASE_NEGATIVE_PATTERNS = [
  /\bno database\b/i,
  /\bwithout database\b/i,
  /\bno db\b/i,
  /\bwithout db\b/i,
  /\bstateless\b/i,
  /\bno persistence\b/i,
  /\bin-memory only\b/i,
  /\bclient-only\b/i
];
var DEPLOYMENT_PATTERNS = [
  /\bdeploy\b/i,
  /\bdeployment\b/i,
  /\bhost\b/i,
  /\bhosting\b/i,
  /\bproduction\b/i,
  /\bship\b/i,
  /\blaunch\b/i,
  /\bgo live\b/i,
  /\bshare\b/i,
  /\bpublic url\b/i
];
var EXTERNAL_API_PATTERNS = [
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
  /\bmarket data\b/i
];
var AI_API_PATTERNS = [
  /\bai\b/i,
  /\bllm\b/i,
  /\bopenai\b/i,
  /\bgpt\b/i,
  /\bchatbot\b/i,
  /\bassistant\b/i,
  /\bsummar(?:ize|ise|ization)\b/i,
  /\bembeddings?\b/i
];
var MULTI_USER_PATTERNS = [/\bmulti-user\b/i, /\bteam\b/i, /\bcollaborat/i, /\bshared\b/i];
var MARKETPLACE_AMBIGUITY_PATTERNS = [
  /\bmarketplace\b/i,
  /\bplatform\b/i,
  /\bcommunity\b/i,
  /\bdirectory\b/i,
  /\bportal\b/i
];
var REALTIME_OR_BACKGROUND_PATTERNS = [
  /\brealtime\b/i,
  /\bbackground\b/i,
  /\bcron\b/i,
  /\bqueue\b/i,
  /\bwebhook\b/i,
  /\bworker\b/i
];
var LOW_LEVEL_DETAIL_PATTERNS = [
  /\bhtml\b/i,
  /\bcss\b/i,
  /\bjavascript\b/i,
  /\btypescript\b/i,
  /\bcreate files?\b/i,
  /\bfile[- ]by[- ]file\b/i,
  /\bwebpack\b/i,
  /\bboilerplate\b/i,
  /\bfolder structure\b/i,
  /\bsetup config\b/i
];
var SECTION_TO_CATEGORY = {
  "development tools": "development",
  databases: "database",
  auth: "auth",
  deployment: "deployment",
  terminal: "terminal",
  apis: "api"
};
function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}
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
function countPatternMatches(text, patterns) {
  return patterns.reduce((total, pattern) => total + (pattern.test(text) ? 1 : 0), 0);
}
function hasPatternMatch(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}
function isRequired(confidence) {
  return confidence >= REQUIRED_THRESHOLD;
}
function isAmbiguous(confidence) {
  return confidence >= AMBIGUOUS_THRESHOLD_MIN && confidence <= AMBIGUOUS_THRESHOLD_MAX;
}
function getMaxPrimaryTools(complexity) {
  if (complexity === "simple") return 2;
  if (complexity === "medium") return 3;
  return 4;
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
var GUIDE_TOOL_NAMES = new Set(GUIDE_TOOLS.map((tool) => tool.name));
var GUIDE_TOOL_BY_NAME = new Map(GUIDE_TOOLS.map((tool) => [tool.name, tool]));
function getToolsByCategory(category) {
  return GUIDE_TOOLS.filter((tool) => tool.category === category);
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
function hasAskedClarifyingQuestion(messages) {
  const normalizedQuestion = normalizeText(CLARIFYING_QUESTION);
  return messages.some(
    (message) => message.role === "assistant" && normalizeText(message.content).includes(normalizedQuestion)
  );
}
function inferCapabilityConfidence(message) {
  const authPositiveMatches = countPatternMatches(message, AUTH_POSITIVE_PATTERNS);
  const authNegativeMatches = countPatternMatches(message, AUTH_NEGATIVE_PATTERNS);
  const databasePositiveMatches = countPatternMatches(message, DATABASE_POSITIVE_PATTERNS);
  const databaseNegativeMatches = countPatternMatches(message, DATABASE_NEGATIVE_PATTERNS);
  const deploymentMatches = countPatternMatches(message, DEPLOYMENT_PATTERNS);
  const externalApiMatches = countPatternMatches(message, EXTERNAL_API_PATTERNS);
  const aiApiMatches = countPatternMatches(message, AI_API_PATTERNS);
  const hasMultiUserLanguage = hasPatternMatch(message, MULTI_USER_PATTERNS);
  const hasRealtimeOrBackgroundLanguage = hasPatternMatch(message, REALTIME_OR_BACKGROUND_PATTERNS);
  const hasMarketplaceAmbiguity = hasPatternMatch(message, MARKETPLACE_AMBIGUITY_PATTERNS);
  const hasDeploymentLanguage = deploymentMatches > 0;
  const hasExplicitLoginLanguage = /\blogin\b/i.test(message) || /\bsign[ -]?in\b/i.test(message) || /\bauth(?:entication)?\b/i.test(message);
  const hasSavedDataLanguage = /\bsaved?\s+(tasks?|items?|records?|data|history|messages?)\b/i.test(
    message
  );
  const hasChatHistoryLanguage = /\bchat history\b/i.test(message) || /\bconversation history\b/i.test(message) || /\bhistory\b.*\bchat\b/i.test(message);
  const hasGroceryPriceComparison = /\bcompar(?:e|es|ing)\b.*\bprices?\b/i.test(message) || /\bgrocery\b/i.test(message) && /\bprices?\b/i.test(message);
  const hasCompareStoresLanguage = /\bcompar(?:e|es|ing)\b/i.test(message) && /\bstores?\b/i.test(message);
  const hasAiAppLanguage = /\b(ai|llm|gpt|openai|assistant|chatbot)\b/i.test(message);
  const hasAiStudyAssistantLanguage = /\bai study assistant\b/i.test(message);
  const needsAuth = clamp(
    0.08 + authPositiveMatches * 0.52 + (hasExplicitLoginLanguage ? 0.16 : 0) + (hasMultiUserLanguage ? 0.15 : 0) + (hasMarketplaceAmbiguity ? 0.38 : 0) - authNegativeMatches * 0.75
  );
  const needsDatabase = clamp(
    0.08 + databasePositiveMatches * 0.3 + (hasSavedDataLanguage ? 0.42 : 0) + (hasChatHistoryLanguage ? 0.38 : 0) + (hasRealtimeOrBackgroundLanguage ? 0.16 : 0) + (hasMultiUserLanguage ? 0.08 : 0) - (hasMarketplaceAmbiguity ? 0.35 : 0) - databaseNegativeMatches * 0.8
  );
  const needsDeployment = clamp(0.05 + deploymentMatches * 0.3 + (hasMultiUserLanguage ? 0.08 : 0));
  const needsExternalApi = clamp(
    0.05 + externalApiMatches * 0.24 + (hasGroceryPriceComparison ? 0.35 : 0) + (hasCompareStoresLanguage ? 0.12 : 0)
  );
  const needsAiApi = clamp(
    0.03 + aiApiMatches * 0.34 + (hasAiStudyAssistantLanguage ? 0.32 : 0) + (hasChatHistoryLanguage && hasAiAppLanguage ? 0.18 : 0)
  );
  return {
    confidence: {
      needsAuth,
      needsDatabase,
      needsDeployment,
      needsExternalApi,
      needsAiApi
    },
    explicitNegations: {
      auth: authNegativeMatches > 0,
      database: databaseNegativeMatches > 0
    },
    signals: {
      hasMultiUserLanguage,
      hasRealtimeOrBackgroundLanguage,
      hasDeploymentLanguage
    }
  };
}
function inferComplexityScore(intent) {
  let score = 0;
  if (intent.requires.auth) score += 1;
  if (intent.requires.database) score += 1;
  if (intent.requires.aiApi) score += 1;
  if (intent.signals.hasRealtimeOrBackgroundLanguage) score += 1;
  if (intent.signals.hasMultiUserLanguage) score += 1;
  if (!intent.requires.auth && !intent.requires.database && !intent.requires.aiApi && intent.confidence.needsDeployment >= REQUIRED_THRESHOLD) {
    score += 1;
  }
  return score;
}
function scoreToComplexity(score) {
  if (score <= 1) return "simple";
  if (score === 2) return "medium";
  return "complex";
}
function inferStackIntent(latestUserMessage, messages) {
  const { confidence, explicitNegations, signals } = inferCapabilityConfidence(latestUserMessage);
  const requiresAuth = isRequired(confidence.needsAuth) && !explicitNegations.auth;
  const requiresDatabase = isRequired(confidence.needsDatabase) && !explicitNegations.database;
  const ambiguousAuth = isAmbiguous(confidence.needsAuth) && !explicitNegations.auth;
  const ambiguousDatabase = isAmbiguous(confidence.needsDatabase) && !explicitNegations.database;
  const alreadyAskedClarifyingQuestion = hasAskedClarifyingQuestion(messages);
  const shouldAskClarifyingQuestion = (ambiguousAuth || ambiguousDatabase) && !alreadyAskedClarifyingQuestion;
  const complexityScore = inferComplexityScore({
    confidence,
    signals,
    requires: {
      auth: requiresAuth,
      database: requiresDatabase,
      aiApi: isRequired(confidence.needsAiApi)
    }
  });
  const complexity = scoreToComplexity(complexityScore);
  const requiresDeployment = isRequired(confidence.needsDeployment) || signals.hasDeploymentLanguage;
  const requires = {
    auth: alreadyAskedClarifyingQuestion && ambiguousAuth ? false : requiresAuth,
    database: alreadyAskedClarifyingQuestion && ambiguousDatabase ? false : requiresDatabase,
    deployment: requiresDeployment,
    externalApi: isRequired(confidence.needsExternalApi),
    aiApi: isRequired(confidence.needsAiApi)
  };
  return {
    confidence,
    complexity,
    complexityScore,
    maxPrimaryTools: getMaxPrimaryTools(complexity),
    requires,
    ambiguous: {
      auth: ambiguousAuth,
      database: ambiguousDatabase
    },
    explicitNegations,
    alreadyAskedClarifyingQuestion,
    shouldAskClarifyingQuestion
  };
}
function selectTopToolByCategory(rankedTools, category, usedToolIds) {
  const rankedMatch = rankedTools.find((tool) => tool.category === category && !usedToolIds.has(tool.id));
  if (rankedMatch) return rankedMatch;
  return getToolsByCategory(category).find((tool) => !usedToolIds.has(tool.id)) ?? null;
}
function dedupeTools(tools) {
  const seen = /* @__PURE__ */ new Set();
  return tools.filter((tool) => {
    if (seen.has(tool.id)) return false;
    seen.add(tool.id);
    return true;
  });
}
function buildStackPlan(intent, latestUserMessage) {
  const rankedTools = rankGuideToolsByQuery(latestUserMessage, 40);
  const usedToolIds = /* @__PURE__ */ new Set();
  const primaryTools = [];
  const addLaterTools = [];
  const developmentTool = selectTopToolByCategory(rankedTools, "development", usedToolIds);
  if (developmentTool) {
    primaryTools.push(developmentTool);
    usedToolIds.add(developmentTool.id);
  }
  const requiredCategoryOrder = [];
  if (intent.requires.aiApi) requiredCategoryOrder.push("api");
  if (intent.requires.database) requiredCategoryOrder.push("database");
  if (intent.requires.auth) requiredCategoryOrder.push("auth");
  if (intent.requires.deployment) requiredCategoryOrder.push("deployment");
  for (const category of requiredCategoryOrder) {
    const tool = selectTopToolByCategory(rankedTools, category, usedToolIds);
    if (!tool) continue;
    primaryTools.push(tool);
    usedToolIds.add(tool.id);
  }
  if (intent.ambiguous.auth) {
    const authTool = selectTopToolByCategory(rankedTools, "auth", usedToolIds);
    if (authTool) {
      addLaterTools.push(authTool);
      usedToolIds.add(authTool.id);
    }
  }
  if (intent.ambiguous.database) {
    const databaseTool = selectTopToolByCategory(rankedTools, "database", usedToolIds);
    if (databaseTool) {
      addLaterTools.push(databaseTool);
      usedToolIds.add(databaseTool.id);
    }
  }
  if (!intent.requires.deployment && intent.complexity !== "simple") {
    const deploymentTool = selectTopToolByCategory(rankedTools, "deployment", usedToolIds);
    if (deploymentTool) {
      addLaterTools.push(deploymentTool);
      usedToolIds.add(deploymentTool.id);
    }
  }
  while (primaryTools.length > intent.maxPrimaryTools) {
    const overflow = primaryTools.pop();
    if (overflow) {
      addLaterTools.unshift(overflow);
    }
  }
  const alternatives = [];
  const alternativeDev = rankedTools.find(
    (tool) => tool.category === "development" && !primaryTools.some((primaryTool) => primaryTool.id === tool.id) && !addLaterTools.some((laterTool) => laterTool.id === tool.id)
  );
  if (alternativeDev) {
    alternatives.push(alternativeDev);
  }
  const alternativeDeploy = rankedTools.find(
    (tool) => tool.category === "deployment" && !primaryTools.some((primaryTool) => primaryTool.id === tool.id) && !addLaterTools.some((laterTool) => laterTool.id === tool.id)
  );
  if (alternativeDeploy) {
    alternatives.push(alternativeDeploy);
  }
  return {
    primaryTools: dedupeTools(primaryTools),
    addLaterTools: dedupeTools(addLaterTools).slice(0, 2),
    alternativeTools: dedupeTools(alternatives).slice(0, 2)
  };
}
function buildCandidateToolsPromptBlock(plan) {
  const lines = [];
  lines.push("Primary candidate tools:");
  if (plan.primaryTools.length === 0) {
    lines.push("- None");
  } else {
    for (const tool of plan.primaryTools) {
      lines.push(`- ${tool.name} (${tool.sectionTitle}) - ${tool.tagline}`);
    }
  }
  if (plan.addLaterTools.length > 0) {
    lines.push("Optional add-later candidates:");
    for (const tool of plan.addLaterTools) {
      lines.push(`- ${tool.name} (${tool.sectionTitle}) - ${tool.tagline}`);
    }
  }
  if (plan.alternativeTools.length > 0) {
    lines.push("Alternatives if a candidate does not fit:");
    for (const tool of plan.alternativeTools) {
      lines.push(`- ${tool.name} (${tool.sectionTitle}) - ${tool.tagline}`);
    }
  }
  return lines.join("\n");
}
function buildIntentSummaryPromptBlock(intent) {
  return [
    `- Auth required: ${intent.requires.auth ? "yes" : "no"}`,
    `- Database required: ${intent.requires.database ? "yes" : "no"}`,
    `- Deployment required: ${intent.requires.deployment ? "yes" : "no"}`,
    `- External API likely required: ${intent.requires.externalApi ? "yes" : "no"}`,
    `- AI API required: ${intent.requires.aiApi ? "yes" : "no"}`,
    `- Complexity: ${intent.complexity} (max ${intent.maxPrimaryTools} tools in Best first version)`
  ].join("\n");
}
function buildSystemPrompt(opts) {
  if (opts.mode === "suggest-stack") {
    const intent = opts.stackIntent;
    const stackPlan = opts.stackPlan;
    if (!intent || !stackPlan) {
      return [
        "You suggest minimal stacks for vibe coders.",
        "Keep recommendations concise and practical."
      ].join("\n");
    }
    return [
      "You are a stack advisor for vibe coders (AI-assisted coding, minimal config, ship fast).",
      "Recommend the minimum viable build path for this specific app idea.",
      "Speak like a pragmatic AI pair programmer, not a framework tutorial.",
      "Do NOT recommend a tool from every guide section by default.",
      "",
      "Intent analysis from backend policy (treat as hard constraints):",
      buildIntentSummaryPromptBlock(intent),
      "",
      "Candidate tools (prefer these when relevant):",
      buildCandidateToolsPromptBlock(stackPlan),
      "",
      "Output style:",
      "- Start with one short recommendation sentence.",
      "- Then provide 2 to 4 concise bullets total.",
      "- First bullet must start with: Start with **<development tool>** - <why this fits>.",
      "- Pick the development tool that best fits the request. Do not force a default tool.",
      "- Mention at most one supporting tool unless required by intent.",
      "- Add an external data/API bullet only when External API required is yes.",
      "- If relevant, add one bullet that starts with: Later if needed: ...",
      "",
      "Hard rules:",
      "- Never include auth tools in primary recommendation unless Auth required is yes.",
      "- Never include database tools in primary recommendation unless Database required is yes.",
      "- Keep primary recommended guide tools within the max tool cap from intent analysis.",
      "- Never mention low-level implementation details: HTML/CSS/JavaScript steps, file creation, boilerplate, folder structure, or build config.",
      "- Keep language high-level, agentic, and beginner-friendly for vibe coders.",
      "- No [Guide] or [Other] labels."
    ].join("\n");
  }
  if (opts.context) {
    return `The user is asking about ${opts.context.toolName}. Use this description: ${opts.context.toolDescription}. Answer their question concisely.`;
  }
  return DEFAULT_SYSTEM_PROMPT;
}
function getModelForMode(mode) {
  return mode === "suggest-stack" ? "gpt-4o" : "gpt-4o-mini";
}
function includesNormalizedPhrase(haystack, phrase) {
  const normalizedPhrase = normalizeText(phrase);
  if (!normalizedPhrase) return false;
  return haystack.includes(` ${normalizedPhrase} `);
}
function extractMentionedGuideTools(content) {
  const haystack = ` ${normalizeText(content)} `;
  const mentioned = /* @__PURE__ */ new Set();
  for (const tool of GUIDE_TOOLS) {
    if (includesNormalizedPhrase(haystack, tool.name)) {
      mentioned.add(tool.name);
      continue;
    }
    for (const alias of tool.aliases) {
      if (includesNormalizedPhrase(haystack, alias)) {
        mentioned.add(tool.name);
        break;
      }
    }
  }
  return Array.from(mentioned);
}
function getMentionedToolsByCategory(toolNames) {
  const categorized = {
    development: [],
    database: [],
    auth: [],
    deployment: [],
    terminal: [],
    api: [],
    other: []
  };
  for (const toolName of toolNames) {
    const tool = GUIDE_TOOL_BY_NAME.get(toolName);
    if (!tool) continue;
    categorized[tool.category].push(tool.name);
  }
  return categorized;
}
function extractBulletLines(section) {
  return section.split("\n").map((line) => line.trim()).filter((line) => /^[-*]\s+/.test(line));
}
function extractPrimaryToolNames(content) {
  const bulletLines = extractBulletLines(content).filter((line) => !/^[-*]\s*later if needed\b/i.test(line));
  const seen = /* @__PURE__ */ new Set();
  const orderedNames = [];
  for (const line of bulletLines) {
    const lineTools = extractMentionedGuideTools(line);
    for (const toolName of lineTools) {
      if (!seen.has(toolName)) {
        seen.add(toolName);
        orderedNames.push(toolName);
      }
    }
  }
  return orderedNames;
}
function hasLowLevelDetails(content) {
  return LOW_LEVEL_DETAIL_PATTERNS.some((pattern) => pattern.test(content));
}
function validateSuggestStackResponse(content, intent) {
  const mentionedToolNames = extractMentionedGuideTools(content);
  const mentionedByCategory = getMentionedToolsByCategory(mentionedToolNames);
  const primaryToolNames = extractPrimaryToolNames(content);
  const bulletLines = extractBulletLines(content);
  const firstBullet = bulletLines[0] ?? "";
  const firstBulletStartsWithStartWith = /^[-*]\s*start with\b/i.test(firstBullet);
  const firstBulletToolNames = extractMentionedGuideTools(firstBullet);
  const firstBulletHasDevelopmentTool = firstBulletToolNames.some(
    (toolName) => GUIDE_TOOL_BY_NAME.get(toolName)?.category === "development"
  );
  const missingDevelopmentTool = !firstBulletStartsWithStartWith || !firstBulletHasDevelopmentTool || mentionedByCategory.development.length === 0;
  const unneededAuth = !intent.requires.auth && mentionedByCategory.auth.length > 0;
  const unneededDatabase = !intent.requires.database && mentionedByCategory.database.length > 0;
  const tooManyTools = primaryToolNames.length > intent.maxPrimaryTools;
  const containsLowLevelDetails = hasLowLevelDetails(content);
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const tooVerbose = bulletLines.length > 4 || wordCount > 140;
  const details = [];
  if (missingDevelopmentTool) {
    details.push(
      'First bullet must start with "Start with **<development tool>**" and include one development tool.'
    );
  }
  if (unneededAuth) {
    details.push("Remove auth tools unless user intent clearly requires user accounts.");
  }
  if (unneededDatabase) {
    details.push("Remove database tools unless user intent clearly requires saved data.");
  }
  if (tooManyTools) {
    details.push(`Keep the primary stack to at most ${intent.maxPrimaryTools} guide tools.`);
  }
  if (containsLowLevelDetails) {
    details.push(
      "Remove low-level implementation details (HTML/CSS/JavaScript/file setup/config) and keep coaching high-level."
    );
  }
  if (tooVerbose) {
    details.push("Keep the answer concise: one short sentence plus up to four bullets.");
  }
  const violations = {
    missingDevelopmentTool,
    unneededAuth,
    unneededDatabase,
    tooManyTools,
    containsLowLevelDetails,
    tooVerbose,
    details
  };
  return {
    isValid: details.length === 0,
    mentionedToolNames,
    primaryToolNames,
    violations
  };
}
function buildCorrectionPrompt(params) {
  const violationSummary = params.violations.details.join(" ");
  return [
    "Rewrite your previous answer in a vibe-coder coaching style.",
    violationSummary,
    `Start with one development tool in the first bullet using: Start with **<tool>** - ...`,
    `Keep the stack minimal for ${params.intent.complexity} scope (max ${params.intent.maxPrimaryTools} guide tools).`,
    `Auth required: ${params.intent.requires.auth ? "yes" : "no"}. Include auth tools only if required.`,
    `Database required: ${params.intent.requires.database ? "yes" : "no"}. Include database tools only if required.`,
    `External API required: ${params.intent.requires.externalApi ? "yes" : "no"}.`,
    "Do not include low-level implementation details (HTML/CSS/JavaScript/files/boilerplate/config).",
    "Keep it to one short recommendation sentence and 2-4 concise bullets.",
    buildCandidateToolsPromptBlock(params.stackPlan),
    "No [Guide] or [Other] labels."
  ].join("\n");
}
function buildFallbackSupportReason(tool) {
  if (tool.category === "database") return "saved data";
  if (tool.category === "auth") return "user accounts";
  if (tool.category === "deployment") return "a public share link";
  if (tool.category === "api") return "AI features";
  return tool.sectionTitle.toLowerCase();
}
function buildDataSourceHint(latestUserMessage) {
  if (/grocery|store|prices?/i.test(latestUserMessage)) {
    return "Use one grocery or retail pricing API first, then add more store sources after the MVP works.";
  }
  if (/weather/i.test(latestUserMessage)) {
    return "Use one weather API first so your first version stays easy to test and iterate.";
  }
  if (/stock|market/i.test(latestUserMessage)) {
    return "Use one market-data API first and expand providers later.";
  }
  return "Use one reliable external API provider first, then expand once the core flow is working.";
}
function joinWithAnd(values) {
  if (values.length <= 1) return values[0] || "";
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, and ${values[values.length - 1]}`;
}
function buildFallbackSuggestStackResponse(params) {
  const rankedFallbackTools = getFallbackRankedTools();
  const developmentTool = params.stackPlan.primaryTools.find((tool) => tool.category === "development") || rankedFallbackTools.find((tool) => tool.category === "development");
  if (!developmentTool) {
    return [
      "Start with one development tool and keep the first version tight.",
      "- Start with **your preferred development tool** - ask it to build one usable first version end-to-end.",
      "- Keep scope to one core user flow, then expand only after it works."
    ].join("\n");
  }
  const primarySupportTools = params.stackPlan.primaryTools.filter((tool) => tool.id !== developmentTool.id).filter((tool) => {
    if (tool.category === "auth") return params.intent.requires.auth;
    if (tool.category === "database") return params.intent.requires.database;
    if (tool.category === "deployment") return params.intent.requires.deployment;
    if (tool.category === "api") return params.intent.requires.aiApi;
    return false;
  }).slice(0, Math.max(0, params.intent.maxPrimaryTools - 1));
  const bulletLines = [];
  bulletLines.push(
    `- Start with **${developmentTool.name}** - ${developmentTool.tagline}. Use it to ship a usable first version quickly.`
  );
  if (primarySupportTools.length > 0) {
    const supportPhrases = primarySupportTools.map(
      (tool) => `**${tool.name}** for ${buildFallbackSupportReason(tool)}`
    );
    bulletLines.push(`- Add ${joinWithAnd(supportPhrases)} because this idea needs it in v1.`);
  }
  if (params.intent.requires.externalApi) {
    bulletLines.push(`- Data source: ${buildDataSourceHint(params.latestUserMessage)}`);
  }
  if (bulletLines.length < 2) {
    bulletLines.push("- Keep v1 focused on one core flow first, then add features only after that works.");
  }
  if (bulletLines.length < 4 && params.stackPlan.addLaterTools.length > 0) {
    const deferred = params.stackPlan.addLaterTools[0];
    bulletLines.push(`- Later if needed: **${deferred.name}** for ${buildFallbackSupportReason(deferred)}.`);
  }
  return [
    "Keep the first version lean so you can test the idea fast.",
    ...bulletLines.slice(0, 4)
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
    const response = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.apiKey}`
      },
      body: JSON.stringify({
        model: params.model,
        messages: params.messages
      })
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
function filterToGuideTools(names) {
  return names.filter((name) => GUIDE_TOOL_NAMES.has(name));
}
function summarizeSelectedSections(tools) {
  return Array.from(new Set(tools.map((tool) => tool.sectionTitle)));
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
  let stackIntent;
  let stackPlan;
  if (body.mode === "suggest-stack") {
    stackIntent = inferStackIntent(latestUserMessage, sanitizedMessages);
    logDebug("intent_inferred", {
      complexity: stackIntent.complexity,
      complexityScore: stackIntent.complexityScore,
      maxPrimaryTools: stackIntent.maxPrimaryTools,
      requires: stackIntent.requires,
      ambiguous: stackIntent.ambiguous,
      confidence: stackIntent.confidence,
      alreadyAskedClarifyingQuestion: stackIntent.alreadyAskedClarifyingQuestion,
      shouldAskClarifyingQuestion: stackIntent.shouldAskClarifyingQuestion
    });
    if (stackIntent.shouldAskClarifyingQuestion) {
      logDebug("clarifying_question_returned", {
        ambiguous: stackIntent.ambiguous
      });
      return {
        status: 200,
        json: buildCompletion({
          id: "chatcmpl-clarify",
          model,
          content: CLARIFYING_QUESTION
        })
      };
    }
    stackPlan = buildStackPlan(stackIntent, latestUserMessage);
  }
  const systemPrompt = buildSystemPrompt({
    mode: body.mode,
    context: body.context,
    stackIntent,
    stackPlan
  });
  const baseMessages = [
    { role: "system", content: systemPrompt },
    ...sanitizedMessages
  ];
  logDebug("request_start", {
    mode: body.mode || "default",
    model,
    messageCount: sanitizedMessages.length,
    selectedSections: summarizeSelectedSections(stackPlan?.primaryTools ?? []),
    selectedTools: (stackPlan?.primaryTools ?? []).map((tool) => tool.name)
  });
  const firstAttempt = await fetchChatCompletion({
    apiKey,
    model,
    messages: baseMessages
  });
  if (!firstAttempt.ok) {
    logDebug("first_attempt_error", {
      mode: body.mode || "default",
      status: firstAttempt.status
    });
    return { status: firstAttempt.status, json: { error: firstAttempt.error } };
  }
  if (body.mode !== "suggest-stack" || !stackIntent || !stackPlan) {
    return { status: 200, json: firstAttempt.data };
  }
  const firstContent = getAssistantContent(firstAttempt.data);
  const firstValidation = validateSuggestStackResponse(firstContent, stackIntent);
  logDebug("validation_first", {
    valid: firstValidation.isValid,
    mentionedGuideTools: filterToGuideTools(firstValidation.mentionedToolNames),
    primaryTools: filterToGuideTools(firstValidation.primaryToolNames),
    violations: firstValidation.violations.details
  });
  if (firstValidation.isValid) {
    return { status: 200, json: firstAttempt.data };
  }
  const retryMessages = [...baseMessages];
  if (firstContent) {
    retryMessages.push({ role: "assistant", content: firstContent });
  }
  retryMessages.push({
    role: "user",
    content: buildCorrectionPrompt({
      intent: stackIntent,
      stackPlan,
      violations: firstValidation.violations
    })
  });
  const secondAttempt = await fetchChatCompletion({
    apiKey,
    model,
    messages: retryMessages
  });
  if (secondAttempt.ok) {
    const secondContent = getAssistantContent(secondAttempt.data);
    const secondValidation = validateSuggestStackResponse(secondContent, stackIntent);
    logDebug("validation_retry", {
      valid: secondValidation.isValid,
      mentionedGuideTools: filterToGuideTools(secondValidation.mentionedToolNames),
      primaryTools: filterToGuideTools(secondValidation.primaryToolNames),
      violations: secondValidation.violations.details,
      retryUsed: true
    });
    if (secondValidation.isValid) {
      return { status: 200, json: secondAttempt.data };
    }
  } else {
    logDebug("retry_attempt_error", {
      status: secondAttempt.status,
      retryUsed: true
    });
  }
  const fallbackContent = buildFallbackSuggestStackResponse({
    intent: stackIntent,
    stackPlan,
    latestUserMessage
  });
  logDebug("fallback_used", {
    retryUsed: true,
    selectedSections: summarizeSelectedSections(stackPlan.primaryTools),
    selectedTools: stackPlan.primaryTools.map((tool) => tool.name)
  });
  return {
    status: 200,
    json: buildCompletion({ model, content: fallbackContent })
  };
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
