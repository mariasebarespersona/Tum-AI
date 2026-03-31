# CLAUDE.md — Tumai AI Automation Platform

## What is this project?

Tumai is an AI automation platform that packages 37 production-tested automations into composable modules. Each automation solves one specific problem (payments, AI agents, scraping, documents, etc.) and can be combined like LEGO blocks to build complete business solutions. The platform targets specific industry verticals (property rental, buy-renovate-sell, service businesses, lending, accounting) with pre-configured automation bundles.

The project originated from a real production deployment and is being generalized into a multi-tenant platform.

## Repository Structure

```
tumai/
├── platform/                    # Next.js 14 web application (main product)
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   │   ├── page.tsx         # Visual Canvas — full automation catalog with React Flow
│   │   │   ├── (marketing)/site/page.tsx  # Marketing landing page (light theme)
│   │   │   ├── login/page.tsx   # Auth page (email + name, localStorage session)
│   │   │   ├── dashboard/page.tsx  # KPI dashboard with execution stats
│   │   │   ├── marketplace/page.tsx  # Browse & install automations
│   │   │   ├── executions/page.tsx   # Execution log viewer with filters
│   │   │   ├── editor/page.tsx       # Visual flow editor (drag & drop + React Flow)
│   │   │   ├── integrations/page.tsx # Webhook management
│   │   │   ├── workspace/page.tsx    # Workspace settings, API keys, members
│   │   │   ├── layout.tsx       # Root layout (dark theme, Inter font)
│   │   │   └── globals.css      # CSS variables, React Flow overrides, animations
│   │   ├── components/
│   │   │   ├── FlowCanvas.tsx       # Read-only automation map (37 nodes, 8 categories)
│   │   │   ├── FlowConfigurator.tsx # Conversational chat for configuring flows
│   │   │   ├── AutomationNode.tsx   # Custom React Flow node component
│   │   │   ├── DetailPanel.tsx      # Slide-in panel with automation details
│   │   │   ├── DashboardLayout.tsx  # Sidebar nav + main content wrapper
│   │   │   └── Sidebar.tsx          # Catalog sidebar with search & filters
│   │   ├── lib/
│   │   │   ├── store.ts         # In-memory state + localStorage persistence
│   │   │   └── icons.ts         # Lucide icon registry
│   │   ├── data/
│   │   │   └── automations.ts   # Full catalog: 37 automations with metadata
│   │   └── types/
│   │       └── platform.ts      # Core types: Workspace, Execution, Flow, Webhook, etc.
│   ├── docs/
│   │   └── FLOW_CONFIGURATOR.md # Architecture doc for the flow configurator
│   └── public/videos/           # Marketing videos + video agent tools
├── automations/                 # Automation skill definitions (skill.md per automation)
│   ├── whatsapp-channel/        # WhatsApp integration (Twilio-based)
│   │   ├── skill.md
│   │   ├── config.schema.json
│   │   ├── requirements.txt
│   │   ├── references/          # API docs, conversation patterns
│   │   └── examples/            # Usage examples
│   ├── ai-data-assistant/skill.md
│   ├── ai-voice-processor/skill.md
│   ├── payment-reminders/skill.md
│   ├── rules-engine/skill.md
│   ├── pdf-generator/skill.md
│   ├── ... (20+ more skill.md files)
│   └── [automation-id]/skill.md
├── cli/
│   └── housing_flow.py          # Python CLI flow: scrape → filter → WhatsApp
├── docs/
│   ├── VISION.md                # Product vision, principles, full 37-automation catalog
│   ├── PLAN.md                  # Execution plan (4 phases), current status
│   ├── STRATEGY.md              # Vertical strategy, standardization, pricing
│   └── WHATSAPP_ARCHITECTURE.md # WhatsApp channel architecture & integration guide
└── .gitignore
```

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript 5
- **Visual Canvas**: React Flow v12 (`@xyflow/react`)
- **Styling**: Tailwind CSS 3.4, custom CSS variables (dark theme)
- **Icons**: Lucide React
- **State**: In-memory store with localStorage persistence (no backend DB yet)
- **Font**: Inter (Google Fonts)
- **CLI**: Python 3 (Apify + Twilio)

## Development Commands

```bash
cd platform
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
```

## Key Concepts

### Automation
A self-contained module that solves one business problem. Defined by:
- `id`: kebab-case identifier (e.g., `recurring-payment-gen`)
- `skill.md`: Documentation — what it does, when to use, variables, limitations
- `config.schema.json`: JSON Schema for required variables
- `variables`: Configuration inputs (secrets, strings, numbers)
- `dependencies`: Other automations it depends on
- `category`: One of 8 categories (payments, accounting, ai, communication, data, documents, analytics, infrastructure)
- `verticals`: Which industry verticals include this automation
- `status`: production | draft | planned

### Category System
8 categories, each with a color used throughout the UI:
- Payments & Collections (orange `#f97316`) — 8 automations
- Accounting (cyan `#06b6d4`) — 5 automations
- AI Agents (purple `#8b5cf6`) — 7 automations
- Communication (blue `#3b82f6`) — 4 automations
- Documents (amber `#f59e0b`) — 4 automations
- Data Collection (green `#10b981`) — 3 automations
- Analytics & Rules (red `#ef4444`) — 3 automations
- Infrastructure (gray `#6b7280`) — 2 automations

### Verticals
Pre-packaged bundles of automations for specific industries:
- Property Rental (20 automations)
- Buy-Renovate-Sell (35 — all)
- Service Business (15)
- Lending & Financing (18)
- Accounting Standalone (12)

### Flow
A user-composed pipeline of connected automations. Built in the visual editor (`/editor`), configured via the FlowConfigurator chat, saved to localStorage.

### FlowConfigurator
Conversational chat panel that walks users through configuring each automation in a flow. Uses static question templates per automation type (future: LLM-powered). Follows topological order of the flow graph.

## Architecture Notes

### State Management
All state lives in `lib/store.ts` — a singleton with localStorage persistence. This is intentionally simple; production will replace it with a real database (PostgreSQL / Supabase). Key entities:
- `User`, `Workspace` (auth + multi-tenancy)
- `InstalledAutomation` (what's installed + config)
- `Execution` (run history with logs)
- `Flow` (saved node graphs)
- `Webhook` (external integrations)

### Routing
- `/` — Visual Canvas (read-only automation map)
- `/site` — Marketing landing page (light theme via `(marketing)` route group)
- `/login` → `/dashboard` — Auth flow
- `/dashboard`, `/marketplace`, `/executions`, `/editor`, `/integrations`, `/workspace` — Dashboard pages (wrapped in `DashboardLayout`)

### Theme
Dark theme by default (`#161618` background). Marketing page uses light theme (`#FCFCFC`) via CSS `:has(.marketing-layout)` selector. All dashboard pages use consistent dark palette with CSS custom properties.

### Execution Simulation
Executions are simulated client-side: `createExecution()` starts a timer (1-5s) then calls `completeExecution()` with 85% success rate. Demo data is seeded on first login.

## Important Conventions

- **Industry-generic naming**: All automation names describe the FUNCTION, not a client-specific use case. No client-specific terminology anywhere in the codebase.
- **Variables, not code**: Clients configure automations via variables only — they never touch source code.
- **Composable**: Automations are independent modules that connect via dependencies.
- **English in code/UI**: All UI text and code is in English. Documentation (docs/, skill.md) is in Spanish.
- **Vendor-agnostic**: Database references use "PostgreSQL (or compatible)" — not locked to any specific provider.

## Adding a New Automation

1. Create `automations/[id]/skill.md` following the existing format
2. Add the automation to `platform/src/data/automations.ts` with all metadata
3. Register its icon in `platform/src/lib/icons.ts` if using a new Lucide icon
4. (Optional) Add question templates in `FlowConfigurator.tsx` under `AUTOMATION_QUESTIONS`

## Current Project Status

- **Phase 1** (Visual Catalog): Complete
- **Phase 2** (Platform Features): Complete — dashboard, marketplace, editor, integrations, auth, webhooks, WhatsApp channel, flow configurator
- **Phase 3** (CLI + Export): In progress — CLI prototype exists (`cli/housing_flow.py`)
- **Phase 4** (Multi-Client + Verticals): Planned

## What NOT to Change

- Do not add client-specific terminology (no company names, no domain-specific jargon)
- Do not remove the composability principle — each automation must remain independent
- Do not introduce backend dependencies yet — the localStorage store is intentional for the current phase
- The `automations.ts` catalog is the single source of truth for all automation metadata
