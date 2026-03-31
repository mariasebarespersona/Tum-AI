# Tumai - AI Automation Platform

## Vision
Tumai es una libreria de automatizaciones de AI pre-construidas y probadas en produccion que se pueden componer para crear soluciones personalizadas para cualquier empresa.

## Modelo: "Automatizacion como Producto"
Cada automatizacion es un modulo independiente con:
- `skill.md` — Documentacion: que hace, cuando usarla, limitaciones
- `config.schema.json` — Variables requeridas (validacion con JSON Schema)
- `script.py` — Codigo ejecutable (Python, async-ready)
- `requirements.txt` — Dependencias especificas del modulo
- `tests/` — Tests unitarios y de integracion

## Principios
1. **Cada automatizacion resuelve UN problema especifico** — no "contabilidad completa"
2. **Variables, no codigo** — Los clientes configuran con variables, no tocando codigo
3. **Composable** — Las automatizaciones se pueden combinar como LEGO
4. **Probadas en produccion** — Toda automatizacion viene de un caso real (Maninos fue el primero)
5. **Vendor-agnostic** — Supabase hoy, PostgreSQL manana, Firebase despues
6. **Industry-generic** — Nombres y conceptos estandar, no terminologia de un cliente

---

## Catalogo Completo (35 Automatizaciones)

### Pagos & Cobros (8)
| ID | Nombre | Descripcion |
|----|--------|-------------|
| `recurring-payment-gen` | Recurring Payment Generator | Genera N pagos recurrentes al activar contrato |
| `payment-lifecycle` | Payment Lifecycle Manager | Maquina de estados: scheduled→pending→late→paid |
| `late-fee-calculator` | Late Fee Calculator | Penalizacion configurable por pago tardio |
| `delinquency-risk-scoring` | Delinquency Risk Scoring | Clasifica pagadores por riesgo (critical/high/medium/low) |
| `affordability-calculator` | Affordability Calculator | Ratio deuda/ingreso para aprobar creditos |
| `contract-completion-cascade` | Contract Completion Cascade | Cierre de contrato en cascada: docs + transfer + notificacion |
| `capital-return-manager` | Capital Return Manager | Gestiona devoluciones de capital a inversores/socios |
| `investment-analyzer` | Investment Analyzer | Evalua viabilidad: LTV, ROI, breakeven, cash flow |

### Contabilidad (5)
| ID | Nombre | Descripcion |
|----|--------|-------------|
| `ai-transaction-classifier` | AI Transaction Classifier | GPT-4o clasifica transacciones a cuentas contables |
| `transaction-reconciler` | Transaction Reconciler | Matching automatico banco vs sistema con scoring |
| `ledger-sync` | Transaction Ledger Sync | Auto-crea transaccion contable al registrar evento |
| `portfolio-kpi-engine` | Portfolio KPI Engine | KPIs en tiempo real: collection rate, aging, delinquency |
| `market-price-advisor` | Market Price Advisor | Precio recomendado basado en datos historicos + mercado |

### AI Agents (7)
| ID | Nombre | Descripcion |
|----|--------|-------------|
| `ai-cost-estimator` | AI Cost Estimator | LLM estima costos: materiales, mano de obra, contingencias |
| `ai-price-analyzer` | AI Price Analyzer | LLM recomienda estrategia de pricing |
| `ai-photo-classifier` | AI Photo Classifier | GPT-4 Vision clasifica imagenes en categorias |
| `ai-voice-processor` | AI Voice Processor | Whisper + LLM: audio→datos estructurados |
| `ai-data-assistant` | AI Data Q&A | LLM + function calling sobre datos del negocio |
| `ai-asset-inspector` | AI Asset Inspector | GPT-4 Vision evalua activos contra checklist |
| `ai-quote-builder` | AI Quote Builder | GPT-4 Vision cotiza con catalogo estandar |

### Comunicacion (3)
| ID | Nombre | Descripcion |
|----|--------|-------------|
| `email-scheduler` | Email Scheduler | Cola de emails con templates, reintentos, tracking |
| `payment-reminders` | Payment Reminders | Recordatorios configurables antes/despues de vencimiento |
| `overdue-alerts` | Overdue Alerts | Alerta diaria al admin de pagos vencidos |

### Data Collection (3)
| ID | Nombre | Descripcion |
|----|--------|-------------|
| `web-scraper-json` | JSON API Scraper | Scraping de APIs JSON con filtros y dedup |
| `web-scraper-browser` | Browser Automation | Playwright para sitios con JS/login |
| `screenshot-extractor` | Screenshot Data Extractor | GPT-4 Vision extrae datos de screenshots |

### Documentos (4)
| ID | Nombre | Descripcion |
|----|--------|-------------|
| `pdf-generator` | PDF Generator | PDFs con templates parametrizados |
| `document-storage` | Document Auto-Gen & Storage | Auto-genera docs en eventos + cloud storage |
| `contract-pdf-gen` | Contract PDF Generator | PDF de contrato al activar |
| `periodic-report-gen` | Periodic Report Generator | Reportes periodicos en PDF |

### Analytics & Rules (3)
| ID | Nombre | Descripcion |
|----|--------|-------------|
| `price-predictor` | Price Predictor | Prediccion basada en datos historicos |
| `rules-engine` | Business Rules Engine | Validacion configurable de entidades |
| `financial-analyzer` | Financial Analyzer | LTV, ROI, breakeven, cash flow projection |

### Infraestructura (2)
| ID | Nombre | Descripcion |
|----|--------|-------------|
| `background-scheduler` | Background Scheduler | Scheduler centralizado con cron/interval |
| `data-sync` | Cross-System Data Sync | Sync entre sistemas con dedup |

---

## Verticales

Las automatizaciones se empaquetan en **verticales** — conjuntos pre-armados por industria:

| Vertical | Automatizaciones | Target |
|----------|-----------------|--------|
| **Property Rental** | 20 | Empresas que rentan propiedades |
| **Buy-Renovate-Sell** | 35 (todo) | Comprar, renovar, vender/rentar |
| **Service Business** | 15 | HVAC, plomeria, limpieza |
| **Lending** | 18 | Prestamos, financiamiento |
| **Accounting** | 12 | Contabilidad independiente |

Ver `STRATEGY.md` para detalle de cada vertical.

---

## Diferenciadores vs N8N/Make/Zapier

| | N8N/Make/Zapier | Tumai |
|---|---|---|
| AI Agents nativos | No (plugins) | Core del producto |
| Vision AI | No | Si (GPT-4 Vision) |
| Voice processing | No | Si (Whisper) |
| LLM function calling | Limitado | Core feature |
| Pre-configurado | DIY | Listo en minutos |
| Expertise vertical | Horizontal | Por industria |
| Probado en produccion | Marketplace | Cada automatizacion viene de caso real |

---

## Viabilidad

**Es viable?** Si. Las 36 automatizaciones ya funcionan en produccion con Maninos.
El valor de Tumai es empaquetar conocimiento probado, no inventar desde cero.

**Reutilizable?** Si, manteniendo la disciplina de:
1. Toda automatizacion tiene skill.md + config.schema.json
2. Las variables son el unico punto de personalizacion
3. El codigo no tiene hardcoded nada de un cliente especifico
4. Nombres y conceptos industry-generic (no "RTO", no "Maninos")

**Estimacion:** Con 35 automatizaciones bien empaquetadas, onboarding de nuevo cliente en 1-3 dias.
