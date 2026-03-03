# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

## Project Overview

AI Hackathon Guide is a React + TypeScript single-page application that showcases curated developer tools for AI hackathons. It includes an AI chat assistant powered by OpenAI that helps users find tools, compare options, and get a recommended tech stack.

Deployed on Vercel. The frontend is a Vite-built React SPA; the backend is a single serverless function for chat.

## Commands

- `npm run dev` — Start Vite dev server (includes chat API middleware at `/api/chat`)
- `npm run build` — Full build: TypeScript check → Vite build → esbuild bundles server/chat.ts to api/chat.js
- `npm run build:api` — Build only the serverless API function
- `npm run lint` — ESLint across all .ts/.tsx files
- `npm run preview` — Preview the production build locally
- `npm run test` — Run tests in watch mode (Vitest)
- `npm run test:run` — Run tests once
- `npm run test:coverage` — Run tests with coverage report

## Testing

- **When adding code**: Write or extend tests for every new or changed behavior—unit tests for shared/server logic, component tests for UI. Skip tests only when the change is trivial (e.g. copy or config) or when that part of the codebase has no tests and the task is unrelated.
- **When removing code**: Remove or update the tests that covered the removed behavior so the suite stays accurate and the test run stays green.

## Architecture

### Three-layer split: client / shared / server

- **`src/`** — React frontend (Vite + React 19, Tailwind v4, TypeScript)
- **`shared/chatPolicy.ts`** — All chat logic: message sanitization, system prompts, OpenAI API calls, suggest-stack structured JSON flow, and tool ranking. Imported by both the dev middleware and the production serverless function.
- **`server/chat.ts`** — Thin Vercel serverless handler that delegates to `shared/chatPolicy.ts`. Built to `api/chat.js` via esbuild.

This shared module pattern means chat behavior changes only need to happen in `shared/chatPolicy.ts` — it is used identically in dev (via Vite middleware in `vite.config.ts`) and production (via `server/chat.ts`).

### Content data model

All tool/section content lives in `src/content/sections.ts`. Each `Section` has an id, title, and array of `Tool` objects. Tools carry structured fields: `description`, `bullets`, `detailsGuide`, `detailsVideo`, `detailsSections`. Adding a new tool or section means editing this single file — the UI and chat ranking pick it up automatically.

### Chat modes

The chat has two modes controlled by the `mode` field in the request body:
- **Default mode** — general Q&A using `gpt-4o-mini` with a short system prompt
- **`suggest-stack` mode** — uses `gpt-4o` with `response_format: { type: "json_object" }` to return either a clarifying question or a full stack recommendation. The structured response is parsed and formatted to markdown before being returned. Falls back to local tool ranking if the JSON parse fails.

### Theming

Dark/light theme is driven by a `data-theme` attribute on `<html>`. All colors use CSS custom properties defined in `src/index.css` (e.g. `--bg-base`, `--accent`, `--text-primary`). Components reference these via inline `style` props and Tailwind arbitrary values like `text-[var(--text-primary)]`.

### Key UI components

- **`App.tsx`** — Root layout: sidebar (intro + "Suggest a stack" button) + main content area + chat modal. Manages which section is open and chat state.
- **`ToolCarousel`** — Carousel with keyboard (arrow keys), swipe, and dot navigation. Uses a two-phase animation (out → in) with CSS keyframe classes.
- **`ToolCard`** — Expandable card showing tool details, guide links, and embedded YouTube videos.
- **`SectionPanel`** — Collapsible accordion for each tool category.
- **`ChatPanel`** — Modal chat UI that posts to `/api/chat` and renders markdown responses.

## Environment

Requires `OPENAI_API_KEY` in `.env` (local) or Vercel environment variables (production). See `.env.example`.

## Deployment

Configured for Vercel via `vercel.json`. The build produces:
- `dist/` — static SPA assets
- `api/chat.js` — serverless function (esbuild from `server/chat.ts`)

Rewrites route `/api/*` to serverless functions and everything else to `index.html` for client-side routing.

## Cursor Cloud specific instructions

- **Single-process dev setup**: `npm run dev` starts the Vite dev server on port 5173, which also serves the `/api/chat` endpoint via middleware — no separate backend process is needed.
- **Chat feature requires `OPENAI_API_KEY`**: Without it the chat returns a 500, but the entire tool-browsing UI works fine. Tests do not require the key (they mock fetch).
- **Tests run offline**: `npm run test:run` uses happy-dom and mocked fetch; no dev server or API key needed. The happy-dom environment may log `DOMException [NetworkError]` for embedded YouTube iframes — these are harmless and do not affect test results.
- **Use `--host 0.0.0.0`** when starting the dev server in cloud environments to make it accessible: `npm run dev -- --host 0.0.0.0`.
