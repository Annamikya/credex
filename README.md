# AI Spend Auditor

A modern SaaS application for auditing AI tool spend, discovering downgrade opportunities, and delivering professional savings reports.

## Features

- Landing page with premium SaaS design
- Dynamic audit form with add/remove tools and validation
- Rule-based AI spending audit engine
- Results dashboard with savings metrics and recommendations
- Shareable public audit pages with open graph metadata
- Dark/light toggle and responsive mobile-first layout
- Supabase-ready API routes for audit persistence and email capture

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-inspired component system
- Framer Motion
- Recharts
- React Hook Form + Zod
- Lucide Icons

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

Deploy on Vercel by connecting the repository and setting required environment variables from `.env.example`.
