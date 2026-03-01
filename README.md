# AI Hackathon Guide

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/ayomidecole/AI-Hackathon-Guide)

Welcome to the AI Hackathon Guide!  
This project is designed to give you a set of curated tools, resources, and workflows to help you get started quickly and build amazing AI-powered applications during coding hackathons.

Our goal is to make it as easy as possible for you to discover the best developer tools, frameworks, and libraries, so you can focus on bringing your ideas to life.

## AI Chat Feature

The guide includes an AI assistant that helps you find tools, compare options, and get hackathon tips.

### Local development

1. Create an [OpenAI API key](https://platform.openai.com/api-keys).
2. Copy `.env.example` to `.env` and add your key, or run:
   ```bash
   export OPENAI_API_KEY="your_api_key_here"
   ```
3. Run `npm run dev` and open the chat from the sidebar.

### Production (Vercel)

Set `OPENAI_API_KEY` in your Vercel project: **Project Settings → Environment Variables**.

### Testing

Tests use [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/react), and [happy-dom](https://github.com/capricorn86/happy-dom) as the DOM environment (avoids ESM issues that can occur with jsdom on some setups).

| Command | Description |
|---------|--------------|
| `npm run test` | Run tests in watch mode (re-runs on file changes). |
| `npm run test:run` | Run the full test suite once. Use this before committing. |
| `npm run test:coverage` | Run tests and generate a coverage report. Aims for at least 80% (thresholds in Vitest config). Open `coverage/index.html` in a browser to view the report. |

## Contributing

We welcome all kinds of contributions!

### Code Contributions

- **Create a new branch** for your development work.
- When you're ready, **open a Pull Request (PR)** to have your changes reviewed by the core contributors.
- Please ensure your code is well-documented and tested where possible.

### Ideas & Bug Reports

Don't want to contribute code, but have an idea, found a bug, or want to suggest an improvement?  
**Submit an Issue** here on GitHub — we'd love to hear from you!

Thank you for making this guide better for everyone 🚀