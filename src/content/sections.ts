export interface Tool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  bullets: string[];
  url: string;
  imageUrl?: string;
}

export interface Section {
  id: string;
  title: string;
  tools: Tool[];
}

export const sections: Section[] = [
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
      },
      {
        id: "replit",
        name: "Replit",
        tagline: "Browser-based IDE",
        description: "Run full-stack apps in the cloud with zero setup. Collaborate in real-time.",
        bullets: ["Cloud development", "Real-time collaboration", "Deploy instantly"],
        url: "https://replit.com",
      },
      {
        id: "claude-code",
        name: "Claude Code",
        tagline: "Anthropic's coding assistant",
        description: "Advanced coding capabilities for generation, explanation, and refactoring.",
        bullets: ["Code generation", "Deep explanation", "Refactoring support"],
        url: "https://claude.ai",
      },
      {
        id: "lovable",
        name: "Lovable",
        tagline: "AI-powered app builder",
        description: "Turn prompts into full-stack web apps. Formerly GPT Engineer.",
        bullets: ["Design to code", "Prompt-based building", "Full-stack generation"],
        url: "https://lovable.dev",
      },
    ],
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
        bullets: ["Postgres database", "Authentication", "Realtime subscriptions"],
        url: "https://supabase.com",
      },
    ],
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
        bullets: ["Git-based deployment", "Deploy previews", "Edge functions"],
        url: "https://netlify.com",
      },
      {
        id: "vercel",
        name: "Vercel",
        tagline: "Frontend/Next.js deployment",
        description: "Develop. Preview. Ship. The platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.",
        bullets: ["Next.js optimization", "Serverless functions", "Global edge network"],
        url: "https://vercel.com",
      },
      {
        id: "railway",
        name: "Railway",
        tagline: "Simple app hosting",
        description: "Railway is an infrastructure platform where you can provision infrastructure, develop with that infrastructure locally, and then deploy to the cloud.",
        bullets: ["Zero config", "Cron jobs", "Database provisioning"],
        url: "https://railway.app",
      },
    ],
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
        bullets: ["AI command search", "Block-based output", "Collaborative workflows"],
        url: "https://warp.dev",
      },
    ],
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
      },
    ],
  },
];
