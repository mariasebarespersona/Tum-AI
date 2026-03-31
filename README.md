# Tumai — AI Automation Platform

**Production-ready AI automations that compose like building blocks.**

Tumai is a library of 37 pre-built, production-tested automations that can be composed to create custom business solutions. From payment lifecycle management to AI-powered asset inspection — deploy in days, not months.

---

## What Makes Tumai Different

| | N8N / Make / Zapier | Tumai |
|---|---|---|
| AI Agents | Plugins | Core product (GPT-4 Vision, Whisper, function calling) |
| Setup | DIY from scratch | Pre-configured, ready in minutes |
| Expertise | Horizontal / generic | Vertical-specific (real estate, lending, services) |
| Proven | Marketplace templates | Every automation comes from a real production deployment |

## The Platform

### Visual Automation Canvas
Browse all 37 automations organized by category on an interactive React Flow canvas. Click any node to see full details, variables, dependencies, and use cases.

### Marketplace
Install automations into your workspace with one click. Search by name, filter by category, see what's production-ready.

### Visual Flow Editor
Drag & drop automations onto a canvas, connect them with edges, and configure each one through a conversational chat interface — no forms, no code.

### Dashboard
Monitor executions in real-time, track success rates, view logs, and manage your installed automations.

### Integrations
Create webhooks linked to automations, manage API keys, and connect to external services.

---

## Automation Catalog (37 Automations)

### Payments & Collections (8)
| Automation | Description |
|---|---|
| `recurring-payment-gen` | Generate N recurring payments when a contract activates |
| `payment-lifecycle` | State machine: scheduled -> pending -> late -> paid |
| `late-fee-calculator` | Configurable late fee with grace period and daily charges |
| `delinquency-risk-scoring` | Risk classification: critical / high / medium / low |
| `affordability-calculator` | Debt-to-income ratio for credit approvals |
| `contract-completion-cascade` | Contract close cascade: docs + transfer + notification |
| `capital-return-manager` | Manage capital returns to investors/partners |
| `investment-analyzer` | Evaluate viability: LTV, ROI, breakeven, cash flow |

### Accounting (5)
| Automation | Description |
|---|---|
| `ai-transaction-classifier` | GPT-4o classifies transactions to accounting categories |
| `transaction-reconciler` | Automatic bank vs system matching with scoring |
| `ledger-sync` | Auto-create accounting entries on business events |
| `portfolio-kpi-engine` | Real-time KPIs: collection rate, aging, delinquency |
| `market-price-advisor` | Recommended pricing based on historical + market data |

### AI Agents (7)
| Automation | Description |
|---|---|
| `ai-cost-estimator` | LLM estimates costs: materials, labor, contingencies |
| `ai-price-analyzer` | LLM recommends pricing strategy |
| `ai-photo-classifier` | GPT-4 Vision classifies images into categories |
| `ai-voice-processor` | Whisper + LLM: audio -> structured data |
| `ai-data-assistant` | LLM + function calling for business data Q&A |
| `ai-asset-inspector` | GPT-4 Vision evaluates assets against checklists |
| `ai-quote-builder` | GPT-4 Vision generates quotes from photos |

### Communication (4)
| Automation | Description |
|---|---|
| `email-scheduler` | Email queue with templates, retries, tracking |
| `payment-reminders` | Configurable reminders before/after due dates |
| `overdue-alerts` | Daily admin alert for overdue payments |
| `whatsapp-channel` | Bidirectional WhatsApp via Twilio (outbound + inbound) |

### Data Collection (3)
| Automation | Description |
|---|---|
| `web-scraper-json` | JSON API scraping with filters and dedup |
| `web-scraper-browser` | Playwright-based automation for JS/login sites |
| `screenshot-extractor` | GPT-4 Vision extracts data from screenshots |

### Documents (4)
| Automation | Description |
|---|---|
| `pdf-generator` | PDFs with parameterized templates |
| `document-storage` | Auto-generate docs on events + cloud storage |
| `contract-pdf-gen` | Contract PDF generation on activation |
| `periodic-report-gen` | Periodic reports in PDF format |

### Analytics & Rules (3)
| Automation | Description |
|---|---|
| `price-predictor` | Price prediction based on historical data |
| `rules-engine` | Configurable entity validation rules |
| `financial-analyzer` | LTV, ROI, breakeven, cash flow projection |

### Infrastructure (2)
| Automation | Description |
|---|---|
| `background-scheduler` | Centralized scheduler with cron/interval support |
| `data-sync` | Cross-system data sync with dedup |

---

## Industry Verticals

Automations are packaged into **verticals** — pre-configured bundles by industry:

| Vertical | Automations | Target |
|---|---|---|
| **Property Rental** | 20 | Companies that rent properties |
| **Buy-Renovate-Sell** | 35 (all) | Buy, renovate, sell/rent operations |
| **Service Business** | 15 | HVAC, plumbing, cleaning, maintenance |
| **Lending & Financing** | 18 | Loans, financing, microfinance |
| **Accounting** | 12 | Accounting firms, freelance accountants |

---

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Visual Canvas**: React Flow v12 (`@xyflow/react`)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **CLI**: Python 3 (Apify + Twilio)

## Getting Started

```bash
# Clone the repo
git clone https://github.com/mariasebarespersona/Tum-AI.git
cd Tum-AI

# Install dependencies
cd platform
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the visual automation canvas.

Navigate to [http://localhost:3000/site](http://localhost:3000/site) for the marketing landing page.

### Platform Pages

| Route | Description |
|---|---|
| `/` | Visual Canvas — interactive automation map |
| `/site` | Marketing landing page |
| `/login` | Sign in to the platform |
| `/dashboard` | KPI dashboard |
| `/marketplace` | Browse & install automations |
| `/editor` | Visual flow editor with configurator chat |
| `/executions` | Execution history & logs |
| `/integrations` | Webhook management |
| `/workspace` | Settings, API keys, team members |

### CLI (Housing Scraper Flow)

```bash
# Set up environment variables
cp .env.example .env
# Edit .env with your Apify and Twilio credentials

# Run the housing scraper flow
python3 cli/housing_flow.py
```

This CLI flow demonstrates the Tumai composition pattern: **Scraper -> Rules Engine -> WhatsApp Sender**.

---

## Architecture

### Automation as Product

Each automation is a standalone module with:
- `skill.md` — Documentation: what it does, when to use it, limitations
- `config.schema.json` — Required variables (JSON Schema validation)
- `script.py` — Executable code (Python, async-ready)
- `requirements.txt` — Module-specific dependencies

### Design Principles

1. **One automation = one problem** — no "complete accounting suite"
2. **Variables, not code** — clients configure with variables, never touch code
3. **Composable** — automations combine like LEGO blocks
4. **Production-tested** — every automation comes from a real deployment
5. **Vendor-agnostic** — PostgreSQL today, any database tomorrow
6. **Industry-generic** — standard terminology, not client-specific jargon

---

## Project Status

- [x] **Phase 1**: Visual catalog with 37 automations
- [x] **Phase 2**: Platform features (dashboard, marketplace, editor, integrations, auth, webhooks, flow configurator)
- [ ] **Phase 3**: CLI tool + config export
- [ ] **Phase 4**: Multi-client verticals + billing

---

## License

Proprietary. All rights reserved.
