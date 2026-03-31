# Tumai - Plan de Ejecucion

## Estado Actual
- 1 cliente activo: Maninos Homes/Capital (produccion)
- 35 automatizaciones identificadas y catalogadas
- Plataforma visual construida (React Flow + Next.js 14)
- Nombres estandarizados (industry-generic, sin terminologia de cliente)
- 5 verticales definidos

---

## FASE 1: Visual Catalog + Extraction (Semanas 1-4) ✅ EN PROGRESO

### Semana 1-2: Plataforma Visual ✅ COMPLETO
- [x] App Next.js en `tumai/platform/` con React Flow v12
- [x] Canvas visual con 36 nodos por categoria
- [x] Cada nodo muestra: nombre, categoria, estado, icono, variables
- [x] Sidebar con catalogo agrupado, busqueda, stats
- [x] Click en nodo → panel con detalle completo
- [x] Colores por categoria (8 categorias)
- [x] MiniMap color-coded
- [x] Edges animados mostrando flujo Maninos

### Semana 3-4: Documentacion + Skill Files
- [x] 20 skill.md creados (primeras automatizaciones)
- [ ] 16 skill.md pendientes (nuevas automatizaciones)
- [ ] config.schema.json para cada automatizacion
- [ ] Estandarizar contenido de todos los skill.md

---

## FASE 2: Platform Features (Semanas 5-8) ✅ COMPLETO

### Auth + Multi-tenancy ✅
- [x] Login page (email + name)
- [x] Workspace creation with API keys
- [x] Member management with roles (owner/admin/editor/viewer)
- [x] Session persistence via localStorage

### Backend API + Store ✅
- [x] Platform types (`types/platform.ts`): User, Workspace, Execution, Webhook, Flow
- [x] In-memory store with localStorage persistence (`lib/store.ts`)
- [x] CRUD: automations, executions, flows, webhooks
- [x] Dashboard stats aggregation

### Marketplace ✅
- [x] Browse all 37 automations with search + category filters
- [x] Install/uninstall automations to workspace
- [x] Use case tags and vertical badges

### Execution Engine ✅
- [x] Create executions with simulated async completion
- [x] Execution log viewer with expandable log details
- [x] Status filters (completed/failed/running)
- [x] Run automations from dashboard

### Visual Flow Editor + Configurator ✅
- [x] Drag & drop nodes from categorized palette
- [x] Connect nodes with animated edges
- [x] **Flow Configurator Chat** — conversational config panel
- [x] Question templates per automation type
- [x] Progress bar showing config steps
- [x] Choice buttons, skip, examples
- [x] Config saved to node data + localStorage

### Webhooks & Integrations ✅
- [x] Create webhooks linked to automations
- [x] Toggle active/inactive
- [x] Copy URL and secret
- [x] Event type configuration

### WhatsApp Channel ✅
- [x] `whatsapp-channel` automation added (#37)
- [x] Twilio integration architecture documented
- [x] Standalone FAQ bot example (zero client data)
- [x] Full architecture doc in `tumai/docs/WHATSAPP_ARCHITECTURE.md`

### Client-Agnostic Cleanup ✅
- [x] Removed all "Maninos" references from 37 skill.md files
- [x] Removed `client: 'Maninos'` from automations.ts
- [x] All origins set to "Production deployment"
- [x] Supabase → "PostgreSQL (or compatible)" everywhere
- [x] Category labels in English
- [x] UI fully in English

---

## FASE 3: Composicion + CLI (Semanas 9-12)

### Features Canvas (additional)
- [ ] Exportar flujo como `tumai.config.json`

### CLI Tool
```bash
tumai init my-client          # Crea proyecto
tumai add email-scheduler     # Anade automatizacion
tumai config                  # Wizard para variables
tumai validate                # Valida configuracion
tumai deploy                  # Despliega
```

---

## FASE 4: Multi-Client + Verticals (Semanas 13-16)

- [ ] Templates de verticales pre-armados
- [ ] Wizard de onboarding: seleccionar vertical → deploy
- [ ] Vista multi-cliente en la plataforma
- [ ] Billing integration (Stripe)

---

## Catalogo de 35 Automatizaciones

### Pagos & Cobros (8)
| ID | Nombre | Estado |
|----|--------|--------|
| `recurring-payment-gen` | Recurring Payment Generator | Produccion |
| `payment-lifecycle` | Payment Lifecycle Manager | Produccion |
| `late-fee-calculator` | Late Fee Calculator | Produccion |
| `delinquency-risk-scoring` | Delinquency Risk Scoring | Produccion |
| `affordability-calculator` | Affordability Calculator | Produccion |
| `contract-completion-cascade` | Contract Completion Cascade | Produccion |
| `capital-return-manager` | Capital Return Manager | Produccion |
| `investment-analyzer` | Investment Analyzer | Produccion |

### Contabilidad (5)
| ID | Nombre | Estado |
|----|--------|--------|
| `ai-transaction-classifier` | AI Transaction Classifier | Produccion |
| `transaction-reconciler` | Transaction Reconciler | Produccion |
| `ledger-sync` | Transaction Ledger Sync | Produccion |
| `portfolio-kpi-engine` | Portfolio KPI Engine | Produccion |
| `market-price-advisor` | Market Price Advisor | Produccion |

### AI Agents (7)
| ID | Nombre | Estado |
|----|--------|--------|
| `ai-cost-estimator` | AI Cost Estimator | Produccion |
| `ai-price-analyzer` | AI Price Analyzer | Produccion |
| `ai-photo-classifier` | AI Photo Classifier | Produccion |
| `ai-voice-processor` | AI Voice Processor | Produccion |
| `ai-data-assistant` | AI Data Q&A | Produccion |
| `ai-asset-inspector` | AI Asset Inspector | Produccion |
| `ai-quote-builder` | AI Quote Builder | Produccion |

### Communication (4)
| ID | Nombre | Estado |
|----|--------|--------|
| `email-scheduler` | Email Scheduler | Production |
| `payment-reminders` | Payment Reminders | Production |
| `overdue-alerts` | Overdue Alerts | Production |
| `whatsapp-channel` | WhatsApp Channel | Planned |

### Data Collection (3)
| ID | Nombre | Estado |
|----|--------|--------|
| `web-scraper-json` | JSON API Scraper | Produccion |
| `web-scraper-browser` | Browser Automation | Produccion |
| `screenshot-extractor` | Screenshot Data Extractor | Produccion |

### Documentos (4)
| ID | Nombre | Estado |
|----|--------|--------|
| `pdf-generator` | PDF Generator | Produccion |
| `document-storage` | Document Auto-Gen & Storage | Produccion |
| `contract-pdf-gen` | Contract PDF Generator | Produccion |
| `periodic-report-gen` | Periodic Report Generator | Produccion |

### Analytics & Rules (3)
| ID | Nombre | Estado |
|----|--------|--------|
| `price-predictor` | Price Predictor | Produccion |
| `rules-engine` | Business Rules Engine | Produccion |
| `financial-analyzer` | Financial Analyzer | Produccion |

### Infraestructura (2)
| ID | Nombre | Estado |
|----|--------|--------|
| `background-scheduler` | Background Scheduler | Produccion |
| `data-sync` | Cross-System Data Sync | Produccion |

---

## Pricing (por vertical)

| Tier | Que incluye | Precio |
|------|-------------|--------|
| **Rental Starter** | Vertical "Property Rental" (20 automations) | $499/mes |
| **Rental Pro** | + AI agents (classifier, evaluator, Q&A) | $999/mes |
| **Buy-Renovate-Sell** | Todo (35 automations) | $1,499/mes |
| **Service Business** | Vertical servicios (15 automations) | $499/mes |
| **Accounting** | Vertical contabilidad (12 automations) | $399/mes |
| **Custom Vertical** | Setup nuevo vertical + customs | $2,999/mes + dev |

**Setup fee:** $1,000-$3,000 (one-time, incluye configuracion + training)
