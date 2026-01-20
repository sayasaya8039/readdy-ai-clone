# Readdy AI Clone - AI-Powered Web Builder

AI-powered web application builder that generates React/Next.js code from text, images, or URLs.

## Features

- **Text to Code**: Generate code from natural language prompts
- **Image to Code**: Generate code from UI design images using GPT-4o Vision
- **URL Cloning**: Clone existing websites and convert to React/Next.js
- **Live Editor**: Real-time preview and code editing
- **One-Click Deploy**: Deploy to Vercel, GitHub Pages, or Cloudflare Pages
- **BYOK**: Bring Your Own Key - use your own API keys

## Tech Stack

- Frontend: Next.js 15.1, React 19, TypeScript 5.7, Tailwind CSS 3.4
- Backend: Cloudflare Workers, Hono 4.11
- AI: OpenAI GPT-4o, GPT-4o Vision
- State: Zustand 5.0

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Workers API

```bash
cd workers/api
wrangler secret put OPENAI_API_KEY
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler deploy
```

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 4. Configure API Keys

Go to Settings and enter your API keys.

## Documentation

- [Environment Variables Setup](workers/api/ENV_SETUP_GUIDE.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Testing Guide](TESTING_GUIDE.md)

## Project Structure

```
readdy-ai-clone/
├── app/                  # Next.js App Router
├── components/           # React components
├── lib/                  # Utilities and helpers
├── store/                # Zustand store
├── workers/api/          # Cloudflare Workers API
├── types/                # TypeScript types
└── public/               # Static files
```

## Usage

### Create Project

1. Click "New Project"
2. Choose mode: Text / Image / URL
3. Enter prompt or upload image/URL
4. Click "Create"

### Deploy

1. Click "Deploy" button
2. Select platform: Vercel / GitHub Pages / Cloudflare Pages
3. Enter authentication credentials
4. Click "Deploy"

## Testing

```bash
cd workers/api
bash test-generate.sh
bash test-generate-from-image.sh
bash test-clone-from-url.sh
```

## Performance

- Text generation: 5-15 seconds
- Image generation: 10-30 seconds
- URL cloning: 10-20 seconds

## Roadmap

### v1.0 (Current)

- [x] Text to code generation
- [x] Image to code generation
- [x] URL cloning
- [x] Live editor
- [x] Multi-platform deployment

### v1.1 (Planned)

- [ ] AI chat in editor
- [ ] Component library
- [ ] Templates
- [ ] Version control

## License

MIT License

## Acknowledgments

- OpenAI - GPT-4o API
- Cloudflare - Workers platform
- Vercel - Next.js and hosting
- Readdy.ai - Original inspiration
